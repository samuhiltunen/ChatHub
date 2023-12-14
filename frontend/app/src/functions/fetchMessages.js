import { TokenRefresh } from '../functions/TokenRefresh';

export const fetchMessages = async (utid, setMessages, retryCount = 0) => {
    if (!utid) {
        return;
    }
    try {
        let token = localStorage.getItem('token');
        const messageOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const response = await fetch(`https://api.chathub.kontra.tel/messages/get?utid=${utid}&amnt=50`, messageOptions);
        if (response.status === 401) {
            console.error("Unauthorized, refreshing token...");
            await TokenRefresh();
            if (retryCount < 3) {
                await fetchMessages(utid, setMessages, retryCount + 1);
            } else {
                console.error("Failed to refresh token after 3 attempts");
            }
        } else if (!response.ok) {
            console.error("/messages/get responded with status:", response.status);
            return;
        }
        const data = await response.json();
        setMessages(data.content.sort((a, b) => new Date(a.info.sent) - new Date(b.info.sent)));
    } catch (err) {
        console.error(err);
    }
};