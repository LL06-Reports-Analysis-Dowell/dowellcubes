export default {
    SUCCESS: 'The operation has been successful',
    SOMETHING_WENT_WRONG: 'Something went wrong!',
    NOT_FOUND: (entity) => `${entity} not found`,
    TOO_MANY_REQUESTS: 'Too many requests! Please try again after some time',
    DATACUBE_SERVICE_ERROR: (entity) => `Failed to ${entity}`,
    INVALID_PARAMETER_ERROR: (entity) => `${entity} is required` ,
    API_KEY_MISSING: 'API key is missing, Please provide a valid API key',
    ALREADY_EXIST: (entity, identifier) => `${entity} already exist with ${identifier}`,
    UNAUTHORIZED: `You are not authorized to perform this action`,
    INCORRECT_PASSWORD: `Provided password is incorrect`,
    CUSTOM_ERROR: (entity) => `${entity}`,
};
