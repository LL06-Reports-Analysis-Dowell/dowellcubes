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

app.get('/:portfolioId/:qrcodeId', async (req, res) => {
    try {
        const { portfolioId, qrcodeId } = req.params;

        console.log("Received parameters - portfolioId:", portfolioId, "qrcodeId:", qrcodeId);

        const result = await databaseService.findOriginalLink(portfolioId, qrcodeId);

        console.log("Database query result:", result);

        if (result && result.cubeQrocdeDetails.length > 0) {
            const originalLink = result.cubeQrocdeDetails[0].originalLink;
            console.log("Redirecting to original link:", originalLink);
            return res.redirect(originalLink);
        } else {
            console.log("No matching QR code found. Redirecting to page not found.");
            return res.redirect(`${config.FRONTEND_URL}/page-not-found`);
        }
    } catch (err) {
        console.error("Error occurred:", err);
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
