import httpResponse from '../util/httpResponse.js';
import responseMessage from '../constant/responseMessage.js';
import httpError from '../util/httpError.js';
import quicker from '../util/quicker.js';
import { ValidateCreateCollectionBody, validateJoiSchema, ValidateRegisterBody, ValidateLoginBody } from '../service/validationService.js';
import Datacubeservice from '../service/datacubeService.js';
import databaseService from '../service/databaseService.js';
import { saveUserToDatacubeServices,updateDatabaseAndCollectionStatusServices } from '../service/producerService.js';

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
                isisDatabaseReady: true,
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
                isisDatabaseReady: true,
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
    login: (req, res, next) => {
        try {
            const { body } = req;

            const { value, error } = validateJoiSchema(ValidateLoginBody, body)
            if(error) {
                return httpError(next, error, req, 422);
            }
            httpResponse(req, res, 200, responseMessage.SUCCESS,value);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },
};
