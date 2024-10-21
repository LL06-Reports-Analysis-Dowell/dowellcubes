import { Queue } from 'bullmq';
import config from '../config/config.js';

const saveUserToDatacube = new Queue('save-user-into-datacube', {
    connection: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD
    }
});

export const saveUserToDatacubeServices = async (data) => {
    try {
        const response = await saveUserToDatacube.add('save user data to datacube', data);
        console.log("Added data to queue", response.id);
        if (response) {
            return {
                success: true,
                message: `User data queued successfully with job ID: ${response.id}`
            };
        } else {
            return {
                success: false,
                message: "Failed to queue data"
            };
        }   
    } catch (error) {
        return {
            success: false,
            message: `Error: ${error.message}`
        };
    }
};

const updateDatabaseAndCollectionStatus = new Queue('update-user-database-status', {
    connection: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD
    }
});

export const updateDatabaseAndCollectionStatusServices = async (data) => {
    try {
        const response = await updateDatabaseAndCollectionStatus.add('Update user database status to datacube', data);
        console.log("Added data to queue", response.id);
        if (response) {
            return {
                success: true,
                message: `User data queued successfully with job ID: ${response.id}`
            };
        } else {
            return {
                success: false,
                message: "Failed to queue data"
            };
        }   
    } catch (error) {
        return {
            success: false,
            message: `Error: ${error.message}`
        };
    }
};