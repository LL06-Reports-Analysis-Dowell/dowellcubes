import mongoose from "mongoose";
import { EUserRoles } from '../constant/enumConstant.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDatabaseReady: {
        type: Boolean,
        default: false
    },
    isCollectionReady: {
        type: Boolean,
        default: false
    },
    workspaceId: {
        type: String
    },
    loginInfo: {
        count: {
            type: Number,
            default: 0
        },
        dates: {
            type: [Date],
            default: []
        }
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: EUserRoles,
        default: EUserRoles.OWNER
    }
}, { timestamps: true });


export default mongoose.model("User", userSchema);