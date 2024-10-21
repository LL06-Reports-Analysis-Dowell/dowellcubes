import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { EUserRoles } from '../constant/enumConstant.js';

const portfolioSchema = new mongoose.Schema({
    workspaceName: {
        type: String,
        required: true
    },
    portfolioName: {
        type: String,
        required: true
    },
    portfolioId: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    workspaceId: {
        type: String,
        required: true
    },
    memberType: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [5, "password must be at least 8 chars"],
        select: false
    },
    dataType: {
        type: String,
        required: true
    },
    operationsRight: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
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
    ownerId: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: EUserRoles.PUBLICUSER,
        default: EUserRoles.PUBLICUSER
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });


export default mongoose.model("Portfolio", portfolioSchema);