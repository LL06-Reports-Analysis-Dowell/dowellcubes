import { servicesAxiosInstance } from './config';


export const getServerStatus = async () => {
  const response = await servicesAxiosInstance.get('/v1/self');
  return response.data;
};

export const getServerHealth = async () => {
  const response = await servicesAxiosInstance.get('/v1/health');
  return response.data;
};
