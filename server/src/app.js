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

        console.log("Processing QR code redirect request:", {
            portfolioId,
            qrcodeId,
            timestamp: new Date().toISOString()
        });

        const result = await databaseService.findOriginalLink(portfolioId, qrcodeId);

        if (!result || !result.cubeQrocdeDetails || result.cubeQrocdeDetails.length === 0) {
            console.warn("No QR code found for redirect:", { portfolioId, qrcodeId });
            return res.redirect(`${config.FRONTEND_URL}/page-not-found`);
        }

        const qrCodeDetail = result.cubeQrocdeDetails[0];
        
        if (!qrCodeDetail.originalLink) {
            console.error("Original link missing for QR code:", {
                portfolioId,
                qrcodeId,
                name: qrCodeDetail.name
            });
            return res.redirect(`${config.FRONTEND_URL}/page-not-found`);
        }

        console.log("Redirecting QR code scan:", {
            portfolioId,
            qrcodeId,
            name: qrCodeDetail.name,
            originalLink: qrCodeDetail.originalLink
        });

        return res.redirect(qrCodeDetail.originalLink);

    } catch (err) {
        console.error("Error processing QR code redirect:", {
            portfolioId: req.params.portfolioId,
            qrcodeId: req.params.qrcodeId,
            error: err.message,
            stack: err.stack
        });

        return res.redirect(`${config.FRONTEND_URL}/error`);
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
