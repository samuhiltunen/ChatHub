import { TokenRefresh } from '../functions/TokenRefresh';

export const createMessage = async (utid, messageContent, uploadedFileId, retryCount = 0) => {
    if ((!messageContent || !messageContent.trim()) && !uploadedFileId) {
        return;
    }
    const token = localStorage.getItem('token');

    const messageData = {
        utid: utid,
        content: messageContent,
        attachments: uploadedFileId ? [uploadedFileId] : []
    };

    const messageOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
    };

    try {
        const response = await fetch(`https://api.chathub.kontra.tel/messages/create`, messageOptions);
        if (response.ok) {
            console.log("/message/create ", response.status);
        } else if (response.status === 401 && retryCount < 3) {
            console.error("Unauthorized, refreshing token...");
            await TokenRefresh();
            await createMessage(utid, messageContent, uploadedFileId, retryCount + 1);
        } else if (retryCount >= 3) {
            console.error("Failed to refresh token after 3 attempts");
        }
    } catch (err) {
        console.error(err);
    }
};