import axios from "axios";

export const updaloadQrcodeImage = async (imgData, imgName = null) => {
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
};


export const getUserAPIKey = async (workspaceId) => {
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
};


export const dowellLoginService = async (portfolioName, password, workspaceName) => {
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
};

