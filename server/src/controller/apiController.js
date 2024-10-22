import httpResponse from '../util/httpResponse.js';
import responseMessage from '../constant/responseMessage.js';
import httpError from '../util/httpError.js';
import quicker from '../util/quicker.js';
import { ValidateCreateCollectionBody, validateJoiSchema, ValidateRegisterBody, ValidateAdminLoginBody,ValidatePublicLoginBody,ValidateCreateCubeQrcodeForPublicBody } from '../service/validationService.js';
import Datacubeservice from '../service/datacubeService.js';
import databaseService from '../service/databaseService.js';
import { saveUserToDatacubeServices,updateDatabaseAndCollectionStatusServices } from '../service/producerService.js';
import config from '../config/config.js';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js';
import { EApplicationEnvironment } from '../constant/application.js';
import { EUserRoles } from '../constant/enumConstant.js';

dayjs.extend(utc); 

export default {
    self: (req, res, next) => {
        try {
            httpResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    health: (req, res, next) => {
        try {
            const healthData = {
                application: quicker.getApplicationHealth(),
                system: quicker.getSystemHealth(),
                timestamp: Date.now(),
            };

            httpResponse(req, res, 200, responseMessage.SUCCESS, healthData);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    createCollection: async(req, res, next) => {
        try {
            const { body } = req;
            
            const apiKey = req.headers['authorization'];
            if (!apiKey || !apiKey.startsWith('Bearer ')){
                return httpError(next, err, req, 401);
            }
            
            const { value, error } = validateJoiSchema(ValidateCreateCollectionBody,body)
            
            const { workspaceId, collectionName } = value
            if (error) {
                return httpError(next, error, req, 422);
            }
            
            const datacube = new Datacubeservice(apiKey.split(' ')[1]);

            const response = await datacube.createCollection(
                `${workspaceId}_dowellcube_database`,
                collectionName
            )
            
            if(!response.success){
                return httpError(next, new Error(responseMessage.DATACUBE_SERVICE_ERROR('create collection')), req, 500);
            }

            httpResponse(req, res, 201, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    checkDatabaseStatus: async (req, res, next) => {
        try {
            const { params } = req;
            const { workspaceId } = params;
    
            if (!workspaceId) {
                return httpError(next, new Error(responseMessage.INVALID_PARAMETER_ERROR('workspace id')), req, 400);
            }
    
            const apiKey = req.headers['authorization'];
            if (!apiKey || !apiKey.startsWith('Bearer ')) {
                return httpError(next, new Error(responseMessage.API_KEY_MISSING), req, 401);
            }
    
            const datacube = new Datacubeservice(apiKey.split(' ')[1]);
            const response = await datacube.collectionRetrieval(
                `${workspaceId}_dowellcube_database`
            );

            if (!response.success) {
                return httpError(next, new Error(responseMessage.DATACUBE_SERVICE_ERROR('find database')), req, 500);
            }

            const updateUserDatabaseStatus = await databaseService.updateUserDatabaseStatus(workspaceId, {
                isDatabaseReady: true,
            })

            if(!updateUserDatabaseStatus){
                return httpError(next, new Error(responseMessage.DATACUBE_SERVICE_ERROR('update user database status')), req, 500);
            }
    
            const foundCollections = response.data.flat();

            const listOfMetaDataCollection = [
                `${workspaceId}_dowellcube_user`,
                `${workspaceId}_dowellcube_location`,
                `${workspaceId}_dowellcube_cubes`
            ];

            const missingCollections = listOfMetaDataCollection.filter(collection =>
                !foundCollections.includes(collection)
            );
    
            if (missingCollections.length > 0) {
                const missingCollectionsStr = missingCollections.join(', ');
                return httpError(next,new Error (responseMessage.DATACUBE_SERVICE_ERROR(`find collections: ${missingCollectionsStr}`)), req, 404);
            }

            const updateUserCollectionStatus = await databaseService.updateUserDatabaseStatus(workspaceId, {
                isCollectionReady: true,
            })


            if(!updateUserCollectionStatus){
                return httpError(next, new Error(responseMessage.DATACUBE_SERVICE_ERROR('update user collection status')), req, 500);
            }
            
            console.log("Added to Q or redis server...");
            updateDatabaseAndCollectionStatusServices({
                apiKey: apiKey,
                workspaceId: workspaceId
            })

            httpResponse(req, res, 200, responseMessage.SUCCESS);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    register: async (req, res, next) => {
        try {
            const { body } = req;

            const { value, error } = validateJoiSchema(ValidateRegisterBody, body)

            if(error) {
                return httpError(next, error, req, 422);
            }

            const { username, email, workspaceId,role } = value;

            const existingUser = await databaseService.findByEmailId(email)
            if(existingUser) {
                return httpError(next, new Error(responseMessage.ALREADY_EXIST('user', email)), req, 403);
            }

            const apiKey = await quicker.getUserAPIKey(workspaceId)

            if(!apiKey.success){
                return httpError(next, new Error(responseMessage.NOT_FOUND('API key')), req, 404);
            }

            const payload = {
                username,
                email,
                workspaceId,
                apiKey : apiKey.apiKey,
                role
            }

            const newUser = await databaseService.registerUser(payload)

            if(!newUser){
                return httpError(next, new Error(responseMessage.SOMETHING_WENT_WRONG), req, 500);
            }

            console.log("Added to Q or redis server...");
            saveUserToDatacubeServices(newUser)
            
            httpResponse(req, res, 200, responseMessage.SUCCESS, { _id: newUser._id});
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    adminLogin: async (req, res, next) => {
        try {
            const { body } = req;

            const { value, error } = validateJoiSchema(ValidateAdminLoginBody, body)
            if (error) {
                return httpError(next, error, req, 422);
            }
            const { username,workspaceId } = value;

            
            const user = await databaseService.findUserByWorkspaceIdAndUserNameAndRole(workspaceId, username);

            if(!user){
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404);
            }

            const accessToken = quicker.generateToken(
                {
                    userId: user.id
                },
                config.ACCESS_TOKEN.SECRET,
                config.ACCESS_TOKEN.EXPIRY
            )

            const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL)

            user.loginInfo.count += 1;
            user.loginInfo.dates.push(dayjs().utc().toDate());
            user.save()

            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            })
            
            httpResponse(req, res, 200, responseMessage.SUCCESS,{
                accessToken
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    publicLogin: async (req, res, next) => {
        try {
            const { body } = req;
            const { value, error } = validateJoiSchema(ValidatePublicLoginBody, body);
            if (error) {
                return httpError(next, error, req, 422);
            }
            const { workspaceName, portfolioName, password } = value;
            
            const existingUser = await databaseService.findPublicUser(workspaceName, portfolioName, '+password');
    
            if (existingUser) {
                if (existingUser.password !== password) {
                    return httpError(next, new Error(responseMessage.INCORRECT_PASSWORD), req, 401);
                }
    
                const accessToken = quicker.generateToken(
                    {
                        userId: existingUser.id
                    },
                    config.ACCESS_TOKEN.SECRET,
                    config.ACCESS_TOKEN.EXPIRY
                );
                
                const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL);
                
                existingUser.loginInfo.count += 1;
                existingUser.loginInfo.dates.push(dayjs().utc().toDate());
                existingUser.save();
    
                res.cookie('accessToken', accessToken, {
                    path: '/api/v1',
                    domain: DOMAIN,
                    sameSite: 'strict',
                    maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                    httpOnly: true,
                    secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
                });
    
                return httpResponse(req, res, 200, responseMessage.SUCCESS, { accessToken });
            }
    
            const dowellLoginDetails = await quicker.dowellLoginService(portfolioName, password, workspaceName);
    
            if (!dowellLoginDetails.success) {
                return httpError(next, new Error(responseMessage.INCORRECT_PASSWORD), req, 401);
            }
    
            const dowellLogin = dowellLoginDetails.userinfo;
    
            const ownerDetails = await databaseService.findByUsername(workspaceName);
    
            if (!ownerDetails) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('Owner')), req, 404);
            }
    
            if (!ownerDetails.isActive || !ownerDetails.isDatabaseReady || !ownerDetails.isCollectionReady) {
                let issues = [];
            
                if (!ownerDetails.isActive) {
                    issues.push("Owner's account is not active");
                }
                if (!ownerDetails.isDatabaseReady) {
                    issues.push("Database is not ready");
                }
                if (!ownerDetails.isCollectionReady) {
                    issues.push("Collections are not ready");
                }
            
                return httpError(next, new Error(responseMessage.CUSTOM_ERROR(issues)), req, 401);
            }
    
            const payload = {
                workspaceName: workspaceName,
                portfolioName: portfolioName,
                email: "",
                portfolioId: dowellLogin.portfolio_info.username[0],
                workspaceId: dowellLogin.userinfo.owner_id,
                memberType: dowellLogin.portfolio_info.member_type,
                password: password,
                dataType: dowellLogin.portfolio_info.data_type,
                operationsRight: dowellLogin.portfolio_info.operations_right,
                status: dowellLogin.portfolio_info.status,
                ownerId: ownerDetails._id,
                role: EUserRoles.PUBLICUSER,
                apiKey: ownerDetails.apiKey,
            };
    
            const newUser = await databaseService.registerPublic(payload);
    
            if (!newUser) {
                return httpError(next, new Error(responseMessage.SOMETHING_WENT_WRONG), req, 500);
            }
    
            saveUserToDatacubeServices(newUser);
    
            const accessToken = quicker.generateToken(
                {
                    userId: newUser.id
                },
                config.ACCESS_TOKEN.SECRET,
                config.ACCESS_TOKEN.EXPIRY
            );
    
            const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL);
            
            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            });
    
            return httpResponse(req, res, 200, responseMessage.SUCCESS, { accessToken });
    
        } catch (err) {
            return httpError(next, err, req, 500);
        }
    },
    selfIdentification: (req, res, next) => {
        try {
            const { authenticatedUser } = req
            httpResponse(req, res, 200, responseMessage.SUCCESS, authenticatedUser)
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
    createCubeQrcodeForPublic: async (req, res, next) => {
        try {
            const { authenticatedUser } = req;
            const { body } = req;
    
            const { value, error } = validateJoiSchema(ValidateCreateCubeQrcodeForPublicBody, body);
            if (error) {
                return httpError(next, error, req, 422);
            }
    
            const { latitude, longitude, location, cubeQrocdeDetailsData, numberOfCubeQrcodes } = value;
    
            if (cubeQrocdeDetailsData.length !== numberOfCubeQrcodes) {
                return httpError(next, 'Mismatch between number of QR codes and details provided.', req, 400);
            }
    
            const cubeQrcodeIds = Array(numberOfCubeQrcodes).fill(null).map(() => quicker.generateRandomId());
            const cubeQrocdeDetails = [];
    
            for (let i = 0; i < cubeQrcodeIds.length; i++) {
                const qrcodeId = cubeQrcodeIds[i];
                const qrcodeDetails = cubeQrocdeDetailsData[i];
    
                const qrCodeResult = await quicker.createQrcode(qrcodeId);
                if (!qrCodeResult.success) {
                    return httpError(next, qrCodeResult.message, req, 500);
                }
    
                const qrCodeName = quicker.generateFileName();
                const uploadResult = await quicker.uploadQrcodeImage(qrCodeResult.response.qrCodeData, qrCodeName);

                console.log(uploadResult);
                
                if (!uploadResult.success) {
                    return httpError(next, uploadResult.message, req, 500);
                }
    
                cubeQrocdeDetails.push({
                    qrcodeId,
                    qrcodeImageLink: uploadResult.data.fileUrl,
                    qrcodeLink: qrCodeResult.response.qrcodeLink,
                    qrocdeType: qrcodeDetails.qrcodeType,
                    name: qrcodeDetails.name,
                    originalLink: qrcodeDetails.originalLink,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    numberTimesEmailed: 0
                });
            }
    
            const cubeQrcodePayload = {
                portfolioId: authenticatedUser.portfolioId,
                workspaceId: authenticatedUser.workspaceId,
                portfolioName: authenticatedUser.portfolioName,
                createdBy: authenticatedUser.role,
                apiKey: authenticatedUser.apiKey,
                publicUserId: authenticatedUser._id,
                latitude,
                longitude,
                isActive: true,
                location,
                cubeQrocdeDetails
            };
    
            httpResponse(req, res, 200, responseMessage.SUCCESS, cubeQrcodePayload);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
    
};
