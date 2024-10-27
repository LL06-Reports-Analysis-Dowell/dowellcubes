import express from 'express';
import router from './router/apiRouter.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import responseMessage from './constant/responseMessage.js';
import httpError from './util/httpError.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import databaseService from './service/databaseService.js';
import config from './config/config.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/v1', router);

app.get('/link/:portfolioId/:qrcodeId', async (req, res) => {
    try {
        const { portfolioId, qrcodeId } = req.params;

        const result = await databaseService.findOriginalLink(portfolioId, qrcodeId)

        if (result && result.cubeQrocdeDetails.length > 0) {
            const originalLink = result.cubeQrocdeDetails[0].originalLink;
            return res.redirect(originalLink);
        } else {
            return res.redirect(`${config.FRONTEND_URL}/page-not-found`)
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

app.use((req, res, next) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'));
    } catch (err) {
        httpError(next, err, req, 404);
    }
});



app.use(globalErrorHandler);

export default app;
