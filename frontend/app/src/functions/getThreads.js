import { TokenRefresh } from './TokenRefresh';

export const getThreads = async (uuid, setThreadsData, retryCount = 0) => {
    if (!uuid) {
        return;
    }
    let token = localStorage.getItem('token');
    const threadOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
    };

    try {
        const response = await fetch(`https://api.chathub.kontra.tel/threads/a?members=${uuid}`, threadOptions);
        const data = await response.json();
        if (response.ok) {
            setThreadsData(data.content);
        } else if (response.status === 401 && retryCount < 3) {
            console.error("Unauthorized, refreshing token...");
            await TokenRefresh();
            token = localStorage.getItem('token');
            await getThreads(uuid, threadOptions, setThreadsData, retryCount + 1);
        } else if (retryCount >= 3) {
            console.error("Failed to refresh token after 3 attempts");
        } else {
            console.error("Server responded with status:", response.status);
        }
    } catch (err) {
        console.error(err);
    }
};