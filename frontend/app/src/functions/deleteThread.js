import { TokenRefresh } from './TokenRefresh';

export const deleteThread = async (utid, setThreadsData) => {
    console.log("Deleting thread...", utid);
    let token = localStorage.getItem('token');

    const options = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({utid: utid})
    };

    try {
        const response = await fetch('https://api.chathub.kontra.tel/threads/leave', options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else if (response.status === 401) {
            console.error("Unauthorized, refreshing token...");
            await TokenRefresh();
            token = localStorage.getItem('token');
            await deleteThread(utid, setThreadsData);
        }
        const data = await response.json();
        console.log(data);

        setThreadsData(prevThreads => prevThreads.filter(thread => thread.utid !== utid));

    } catch (err) {
        console.error(err);
    }
};