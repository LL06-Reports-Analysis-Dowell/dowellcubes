import mongoose from 'mongoose';
import config from '../config/config.js';
import userModel from '../model/userModel.js';

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
    }
};
