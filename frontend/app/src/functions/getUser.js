import { TokenRefresh } from './TokenRefresh';
import { getThreads } from './getThreads';

export const getUser = async (setThreadsData, retryCount = 0) => {

    let token = localStorage.getItem('token');
    
    const userOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await fetch(`https://api.chathub.kontra.tel/users/get`, userOptions);
        const data = await response.json();
        if (response.ok) {
            if (data.content.uuid) {
                getThreads(data.content.uuid, setThreadsData);
            } else {
                console.log('User UUID is undefined');
            }
        } else if (response.status === 401 && retryCount < 3) {
            console.error("Unauthorized, refreshing token...");
            await TokenRefresh();
            token = localStorage.getItem('token');
            await getUser(setThreadsData, retryCount + 1);
        } else if (retryCount >= 3) {
            console.error("Failed to refresh token after 3 attempts");
        } else {
            console.error("Server responded with status:", response.status);
        }
    } catch (err) {
        console.error(err);
    }
};