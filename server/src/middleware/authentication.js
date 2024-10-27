import quicker from '../util/quicker.js';
import config from '../config/config.js';
import databaseService from '../service/databaseService.js';
import httpError from '../util/httpError.js';
import responseMessage from '../constant/responseMessage.js';

export default async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const accessToken = authHeader.split(' ')[1];
            const { userId } = quicker.verifyToken(accessToken, config.ACCESS_TOKEN.SECRET);
            
            let user = await databaseService.findUserById(userId);

            if (!user) {
                user = await databaseService.findPortfolioUserById(userId);
            }

            if (user) {
                req.authenticatedUser = user;
                return next();
            }
        }

        return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401);
    } catch (err) {
        return httpError(next, err, req, 500);
    }
};
