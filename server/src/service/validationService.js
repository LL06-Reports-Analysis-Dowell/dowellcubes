import Joi from 'joi';
import { EUserRoles, EQrcodeTypes } from '../constant/enumConstant.js';

export const ValidateCreateCollectionBody = Joi.object({
    workspaceId: Joi.string().min(2).max(1000).trim().required(),
    collectionName: Joi.string().min(2).max(1000).trim().required()
});

export const ValidateRegisterBody = Joi.object({
    username: Joi.string().min(1).max(64).trim().required(),
    email: Joi.string().email().min(6).max(255).trim().required(),
    workspaceId: Joi.string().min(2).max(255).trim().required(),
    role: Joi.string().valid(...Object.values(EUserRoles)).optional()
});

export const ValidateAdminLoginBody = Joi.object({
    username: Joi.string().trim().required(),
    workspaceId: Joi.string().min(2).max(255).trim().required()
});

export const ValidatePublicLoginBody = Joi.object({
    workspaceName: Joi.string().trim().required(),
    portfolioName: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
})

export const ValidateCreateCubeQrcodeForPublicBody = Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    location: Joi.string().required(),
    numberOfCubeQrcodes: Joi.number().min(1).max(10).required(),
    cubeQrocdeDetailsData: Joi.array().items(
        Joi.object({
            qrcodeType: Joi.string().valid(...Object.values(EQrcodeTypes)).required(),
            name: Joi.string().required(),
            originalLink: Joi.string().uri().required()
        })
    )
    .min(1)
    .max(Joi.ref('numberOfCubeQrcodes'))
    .required()
});

export const ValidateShareCubeQrcodes = Joi.object({
    portfolioId: Joi.string().required(),
    workspaceId: Joi.string().required(),
    portfolioName: Joi.string().required()
})
export const validateJoiSchema = (schema, value) => {
    const result = schema.validate(value);
    return {
        value: result.value,
        error: result.error
    };
};
