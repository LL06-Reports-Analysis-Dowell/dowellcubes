import os from 'os';
import QRCode from 'qrcode';
import axios from 'axios';
import config from '../config/config.js';
import jwt from 'jsonwebtoken'

export default {

    getSystemHealth: () => {
        return {
            success: true,
            message: 'System health fetched successfully',
            data: {
                cpuUsage: os.loadavg(),
                totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
                freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
            }
        };
    },

    getApplicationHealth: () => {
        return {
            success: true,
            message: 'Application health fetched successfully',
            data: {
                environment: config.ENV,
                uptime: `${process.uptime().toFixed(2)} Seconds`,
                memoryUsage: {
                    heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                    heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
                },
            }
        };
    },

    updaloadQrcodeImage: async (imgData, imgName = null) => {
        const url = 'https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-qrcode-to-drive/';
        const fileName = imgName || 'qrcode.png';

        try {
            const formData = new FormData();
            const blob = new Blob([imgData], { type: 'image/png' });
            formData.append('file', blob, fileName);

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fileUrl = response.data.file_url;
            return {
                success: true,
                message: 'Uploaded successfully',
                data: { fileUrl, fileName }
            };
        } catch (error) {
            let errorMessage;

            if (error.response) {
                errorMessage = `Server responded with status: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response received from server';
            } else {
                errorMessage = `Error setting up request: ${error.message}`;
            }

            return {
                success: false,
                message: errorMessage,
                data: { fileUrl: null, fileName: null }
            };
        }
    },

    getUserAPIKey: async (workspaceId) => {
        try {
            const response = await axios.get(`https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${workspaceId}`);

            if (!response.data.success) {
                return {
                    success: false,
                    message: 'Failed to get API key for workspace',
                    apiKey: null
                };
            }

            return {
                success: true,
                message: 'Workspace ID fetched successfully',
                apiKey: response.data.data.api_key
            };
        } catch (error) {
            return {
                success: false,
                message: `Error fetching API key: ${error.message}`,
                apiKey: null
            };
        }
    },

    dowellLoginService: async (portfolioName, password, workspaceName) => {
        try {
            const response = await axios.post("https://100093.pythonanywhere.com/api/portfoliologin", {
                portfolio: portfolioName,
                password: password,
                workspace_name: workspaceName,
                username: "false"
            });

            if (response.data?.userinfo?.workspace_name !== workspaceName) {
                return {
                    success: false,
                    message: 'Invalid portfolio or password',
                    userinfo: null
                };
            }

            return {
                success: true,
                message: 'Login successful',
                userinfo: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: `Login failed: ${error.message}`,
                userinfo: null
            };
        }
    },

    createQrcode: async (data, qrcodeColor = '#000000', productName, fileName) => {
        const qrcodeLink = `${config.FRONTEND_URL}/${productName}/${data}`;

        try {
            const qrCodeData = await QRCode.toBuffer(qrcodeLink, {
                errorCorrectionLevel: 'H',
                type: 'png',
                color: {
                    dark: qrcodeColor,
                    light: '#FFFFFF'
                },
                rendererOpts: {
                    quality: 1.0
                },
                width: 250,
            });

            if (!qrCodeData) {
                return {
                    success: false,
                    message: 'Failed to generate QR code',
                    response: {
                        qrcodeUrl: null,
                        qrcodeLink: null
                    }
                };
            }

            const qrcodeUrlResponse = await qricker.updaloadQrcodeImage(qrCodeData, fileName);

            if (!qrcodeUrlResponse.success) {
                return {
                    success: false,
                    message: 'Failed to upload QR code image',
                    response: {
                        qrcodeUrl: null,
                        qrcodeLink: qrcodeLink
                    }
                };
            }

            return {
                success: true,
                message: 'QR code generated and uploaded successfully',
                response: {
                    qrcodeUrl: qrcodeUrlResponse.data.fileUrl,
                    qrcodeLink
                }
            };

        } catch (error) {
            return {
                success: false,
                message: `Error occurred: ${error.message}`,
                response: {
                    qrcodeUrl: null,
                    qrcodeLink: null
                }
            };
        }
    },

    generateFileName:() => {
        const timestamp = Date.now();
        const filename = `qrcode_${timestamp}.png`
        return filename
    },

    generateToken: (payload, secret, expiry) => {
        return jwt.sign(payload, secret, {
            expiresIn: expiry
        })
    },

    getDomainFromUrl: (url) => {
        try {
            const parsedUrl = new URL(url)
            return parsedUrl.hostname
        } catch (err) {
            throw err
        }
    },

    verifyToken: (token, secret) => {
        return jwt.verify(token, secret)
    },
};

