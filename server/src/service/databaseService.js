import mongoose from 'mongoose';
import config from '../config/config.js';
import userModel from '../model/userModel.js';
import { EUserRoles } from '../constant/enumConstant.js';
import portfolioModel from '../model/portfolioModel.js';
import cubeqrcodeModel from '../model/cubeqrcodeModel.js';

export default {
    connect: async () => {
        try {
            await mongoose.connect(config.DATABASE_URL);
            return mongoose.connection;
        } catch (err) {
            throw err;
        }
    },
    findByEmailId: (email,select='') =>{
        return userModel
        .findOne({email})
        .select(select);
    },
    registerUser: (payload) => {
        return userModel.create(payload)
    },
    updateUserDatabaseStatus: (workspaceId, payload) => {
        return userModel
        .updateOne(
            {workspaceId},
            {
                $set: payload
            },
            { new: true }
        )
    },
    findUserByWorkspaceIdAndUserNameAndRole: (workspaceId,username) => {
        return userModel
        .findOne({workspaceId, username, role: EUserRoles.OWNER});
    },
    findUserById: (id, select='') => {
        return userModel.findById(id).select(select);
    },
    findPublicUser: (workspaceName, portfolioName, select = '') => {
        return portfolioModel
            .findOne({ workspaceName, portfolioName, role: EUserRoles.PUBLICUSER })
            .select(select);
    },
    findByUsername: (username) => {
        return userModel.findOne({username});
    },
    registerPublic: (payload) => {
        return portfolioModel.create(payload)
    },
    findPortfolioUserById:(id, select='') => {
        return portfolioModel.findById(id).select(select);
    },
    findCubeQrcode:(portfolioId,workspaceId,portfolioName) =>{
        return cubeqrcodeModel.findOne({ portfolioId, workspaceId, portfolioName})
    },
    createCubeQrcode: (payload) => {
        return cubeqrcodeModel.create(payload)
    },
    findCubeQrcodeByQrcodeId:(portfolioId,workspaceId) => {
        return cubeqrcodeModel.findOne({ portfolioId, workspaceId })
    }, 
    findOriginalLink: async (portfolioId, qrcodeId) => {
        console.log("Executing database query:", {
            portfolioId,
            qrcodeId,
            timestamp: new Date().toISOString()
        });

        // The previous query was using incorrect projection which might filter out valid results
        const result = await cubeqrcodeModel.findOne(
            {
                portfolioId,
                'cubeQrocdeDetails.qrcodeId': qrcodeId
            }
        );

        // If we found a result, find the matching QR code details
        if (result && result.cubeQrocdeDetails) {
            const matchingQRCode = result.cubeQrocdeDetails.find(
                qr => qr.qrcodeId === qrcodeId
            );

            if (matchingQRCode) {
                // Return in the same format as before for compatibility
                return {
                    cubeQrocdeDetails: [matchingQRCode]
                };
            }
        }

        console.log("Database query completed:", {
            found: !!result,
            hasMatchingQRCode: !!(result?.cubeQrocdeDetails?.find(qr => qr.qrcodeId === qrcodeId))
        });

        return null;
    },
    findUserDataByWorkSpaceIdAndDelete: (workspaceId) => {
        return userModel.deleteMany({ workspaceId });
    },
    findCubeQrcodesByWorkspaceId: (workspaceId) => {
        return cubeqrcodeModel.find({ workspaceId });
    }
};
