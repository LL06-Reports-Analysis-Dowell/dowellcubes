import { servicesAxiosInstance } from './config';


export const getServerStatus = async () => {
  const response = await servicesAxiosInstance.get('/v1/self');
  return response.data;
};

export const getServerHealth = async () => {
  const response = await servicesAxiosInstance.get('/v1/health');
  return response.data;
};

export const signin = async (payload) => {
  const response = await servicesAxiosInstance.post('/v1/sign-in/public', payload);
  return response.data;
}

export const selfIdentification = async (accessToken) => {
  const response = await servicesAxiosInstance.get('/v1/self-identification',{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const getCubeQRcode = async (accessToken) => {
  const response = await servicesAxiosInstance.get('/v1/cubes-qrcode',{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export const shareCube = async (data) => {
  const response = await servicesAxiosInstance.post('/v1/share-cubes-qrcode/', data);
  return response.data;
};