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

    return fetch("https://auth.chathub.kontra.tel/token", options)
        .then(response => response.json().then(data => ({ ok: response.ok, status: response.status, data })))
        .then(({ ok, status, data }) => {
            if (ok) {
                localStorage.removeItem('token');
                localStorage.setItem('token', data.accessToken);
                console.log("token refreshed");
            } else {
                throw new Error("Server responded with status: " + status);
            }
        });
}