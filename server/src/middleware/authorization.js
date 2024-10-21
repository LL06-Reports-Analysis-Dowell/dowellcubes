import httpError from '../util/httpError';
import responseMessage from '../constant/responseMessage';

export default (roles) => {
    return (req, _res, next) => {
        try {
            const user = req.authenticatedUser;

            if (!user) {
                return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
            }

            if (!roles.includes(user.role)) {
                return httpError(next, new Error(responseMessage.FORBIDDEN), req, 403);
            }

            next();
        } catch (error) {
            httpError(next, error, req, 500);
        }
    };
};
