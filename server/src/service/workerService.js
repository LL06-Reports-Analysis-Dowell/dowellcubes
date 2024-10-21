import { Worker } from 'bullmq';
import config from '../config/config.js';
import Datacubeservices from './datacubeService.js';

export const saveUserToDatabaseWorker = new Worker(
  'save-user-into-datacube',
  async (job) => {
    const datacubeServices = new Datacubeservices(job.data.apiKey);

    try {
      const extendedData = {
        ...job.data,
        records: [{ record: "1", type: "overall" }]
      };

      const user = await datacubeServices.dataInsertion(
        `${extendedData.workspaceId}_dowellcube_database`,
        `${extendedData.workspaceId}_dowellcube_user`,
        extendedData
      );

      if (!user.success) {
        console.log("Data insertion failed");
        return { 
          success: false,
          message: "Failed to save user data"
        };
      }

      return {
        success: true,
        message: "User data saved successfully"
      };
    } catch (error) {
      console.error("Error during data insertion:", error);
      return {
        success: false,
        message: `Failed to save user data: ${error.message}`
      };
    }
  },
  {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD
    },
    timeout: 300000,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 10000
    }
  }
);

export const updateDatabaseAndCollectionStatusWorker = new Worker(
  'update-user-database-status',
  async (job) => {
    const datacubeServices = new Datacubeservices(job.data.apiKey);

    try {
      
      const databaseStatus = await datacubeServices.dataUpdate(
        `${job.data.workspaceId}_dowellcube_database`,
        `${job.data.workspaceId}_dowellcube_user`,
        { 
          workspaceId: job.data.workspaceId,
          role: 'Owner'
        },
        {
          isDatabaseReady: true,
          isCollectionReady: true
        }
      )

      console.log(databaseStatus);
      
      if (!databaseStatus.success) {
        return { 
          success: false,
          message: "Failed to update the database status"
        };
      }

      return {
        success: true,
        message: "Database status updated successfully"
      };

    } catch {
      return {
        success: false,
        message: `Failed to udpdate datebase status: ${error.message}`
      };
    }
  },
  {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD
    },
    timeout: 300000,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 10000
    }
  }
);