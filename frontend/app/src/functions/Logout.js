
import { useNavigate } from 'react-router-dom';
import { TokenRefresh } from './TokenRefresh';

export const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();

        let token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: refreshToken })
        };

        try {
            let response = await fetch("https://auth.chathub.kontra.tel/logout", options);
            if (response.status === 401) {
                console.log("refreshing token");
                await TokenRefresh();
                token = localStorage.getItem('token');
                response = await fetch("https://auth.chathub.kontra.tel/logout", options);
            }
            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate("/");
                console.log(response.status);
                console.log("logged out");
            } else {
                console.error("/logout Server responded with status:", response.status);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return handleLogout;
}