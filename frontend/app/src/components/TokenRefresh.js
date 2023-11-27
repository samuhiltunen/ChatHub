export const TokenRefresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer `
        },
        body: JSON.stringify({ token: refreshToken })
    };

    try {
        const response = await fetch("https://auth.chathub.kontra.tel/token", options);
        const data = await response.json();
        if (response.ok) {
            localStorage.removeItem('token');
            localStorage.setItem('token', data.token);
            console.log(response.status);
            console.log("token refreshed");
        } else {
            console.error("Server responded with status:", response.status);
        }
    } catch (err) {
        console.error(err);
    }
}