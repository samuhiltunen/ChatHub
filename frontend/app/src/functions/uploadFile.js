import { TokenRefresh } from './TokenRefresh';

export const uploadFile = async (file, retryCount = 0) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const fileOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    };

    delete fileOptions.headers['Content-Type'];

    try {
        const response = await fetch('https://file.chathub.kontra.tel/files', fileOptions);
        const data = await response.json();
        if (!response.ok) {
            console.log("Error uploading file: ", response.status);
        }
        if (response.ok) {
            console.log("/file/uploaded ", response.status);
            return data.content.ufid;
        } else if (response.status === 401 && retryCount < 3) {
            console.error("Unauthorized, refreshing token...");
            await TokenRefresh();
            await uploadFile(file, retryCount + 1);
        } else if (retryCount >= 3) {
            console.error("Failed to refresh token after 3 attempts");
        }
    } catch (err) {
        console.error(err);
    }
};