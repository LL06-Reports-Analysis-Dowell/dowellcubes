import mongoose from 'mongoose';
import config from '../config/config.js';
import userModel from '../model/userModel.js';
import { EUserRoles } from '../constant/enumConstant.js';
import portfolioModel from '../model/portfolioModel.js';

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
};