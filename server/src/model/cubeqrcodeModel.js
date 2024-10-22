import mongoose from 'mongoose';

const cubeQrcodeDetailsSchema = new mongoose.Schema({
    qrcodeId: {
        type: String,
        required: true
    },
    qrcodeImageLink: {
        type: String,
        required: true
    },
    qrcodeLink: {
        type: String,
        required: true
    },
    qrocdeType: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    originalLink: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    numberTimesEmailed: {
        type: Number,
        default: 0
    }
});

const cubeqrcodeSchema = new mongoose.Schema({
    portfolioId: {
        type: String,
        required: true
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    portfolioName: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    publicUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        required: true
    },
    cubeQrocdeDetails: [cubeQrcodeDetailsSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model('CubeQrcode', cubeqrcodeSchema);
