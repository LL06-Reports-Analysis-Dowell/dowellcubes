import app from './app.js';
import config from './config/config.js';
import { initRateLimiter } from './config/rateLimiter.js';
import databaseService from './service/databaseService.js';
import { saveUserToDatabaseWorker, updateDatabaseAndCollectionStatusWorker } from './service/workerService.js';
import logger from './util/logger.js';

const server = app.listen(config.PORT);

const initializeWorker = (worker, name) => {
    worker.on('completed', (job) => {
        logger.info(`Job ${name} completed`, {
            meta: {
                jobId: job.id,
                returnValue: job.returnvalue
            }
        });
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${name} failed`, {
            meta: {
                jobId: job.id,
                error: err.message
            }
        });
    });

    worker
        .waitUntilReady()
        .then(() => {
            logger.info('QUEUE_WORKER_STARTED', {
                meta: {
                    WORKER_NAME: name, 
                    STATUS: 'STARTED SUCCESSFULLY'
                }
            });
        })
        .catch((error) => {
            logger.error(`Failed to start ${name}`, {
                meta: { error: error.message }
            });
        });
};

(async () => {
    try {
        const connection = await databaseService.connect();
        
        if (connection) {
            initializeWorker(saveUserToDatabaseWorker, 'SAVE_USER_TO_DATACUBE');
            initializeWorker(updateDatabaseAndCollectionStatusWorker, 'UPDATE_DATABASE_AND_COLLECTION_STATUS');
            
            logger.info('DATABASE_CONNECTION', {
                meta: {
                    CONNECTION_NAME: connection.name, 
                },
            });

            initRateLimiter(connection);
            logger.info('RATE_LIMITER_INITIATED');
        } else {
            throw new Error("Failed to establish a database connection.");
        }

        logger.info('APPLICATION_STARTED', {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL,
            },
        });
    } catch (err) {
        logger.error('APPLICATION_ERROR', { meta: err.message });

        server.close((error) => {
            if (error) {
                logger.error('SERVER_SHUTDOWN_ERROR', { meta: error.message });
            } else {
                logger.info('SERVER_SHUTDOWN', { meta: 'Server shut down gracefully' });
            }
            process.exit(1);
        });
    }
})();
