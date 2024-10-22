import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';
import { rateLimiterMongo } from '../config/rateLimiter';
import httpError from '../util/httpError';
import responseMessage from '../constant/responseMessage';

export default (req, _, next) => {
    if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
        return next();
    }
    if (rateLimiterMongo) {
        rateLimiterMongo
            .consume(req.ip, 1)
            .then(() => {
                next();
            })
            .catch(() => {
                httpError(next, new Error(responseMessage.TOO_MANY_REQUESTS), req, 429);
            });
    }
};