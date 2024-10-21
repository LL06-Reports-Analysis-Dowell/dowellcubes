import Joi from 'joi';
import { EUserRoles } from '../constant/enumConstant.js';

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

export const ValidateLoginBody = Joi.object({
    username: Joi.string().trim().required(),
    workspaceId: Joi.string()
        .min(2)
        .max(255)
        .trim()
        .when(Joi.object({ role: Joi.string().valid(EUserRoles.OWNER, EUserRoles.TEAMMEMBER) }).unknown(), {
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
    password: Joi.string()
        .min(6)
        .max(255)
        .trim()
        .when(Joi.object({ role: Joi.string().valid(EUserRoles.PUBLICUSER) }).unknown(), {
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
    portfolioName: Joi.string()
        .when(Joi.object({ role: Joi.string().valid(EUserRoles.PUBLICUSER) }).unknown(), {
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
    role: Joi.string().valid(EUserRoles.OWNER, EUserRoles.TEAMMEMBER, EUserRoles.PUBLICUSER).optional(),
});

export const validateJoiSchema = (schema, value) => {
    const result = schema.validate(value);
    return {
        value: result.value,
        error: result.error
    };
};
