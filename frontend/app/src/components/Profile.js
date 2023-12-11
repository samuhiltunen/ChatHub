
import React, { useEffect, useState } from 'react';
import "../css/main.css";
import { Link } from 'react-router-dom';
import "../css/profile.css";
import ProfilePictureChanger from './TestPhoto';
import { Logout } from './Logout';
import { TokenRefresh } from './TokenRefresh';

const StatusChanger = () => {
    const [status, setStatus] = useState('Hello, My name is TestUser!');
    const [isEditing, setIsEditing] = useState(false);
    const [newStatus, setNewStatus] = useState(status);

    const handleButtonClick = () => {
        setIsEditing(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setStatus(newStatus);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setNewStatus(e.target.value);
    };

    return (
        <div>
            {isEditing ? (
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        value={newStatus}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <h2>{status}</h2>
                    <button onClick={handleButtonClick}>Change status</button>
                </div>
            )}
        </div>
    );
};

export default function Profile() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState('');
    const handleLogout = Logout();

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        const getUser = async (retryCount = 0) => {
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
    
            try {
                const response = await fetch(`https://api.chathub.kontra.tel/users/get`, options);
                const data = await response.json();
                if (response.ok) {
                    console.log(response.status);
                    setUsername(data.content.name);
                    setUserId(data.content.uuid);
                } else if (response.status === 401 && retryCount < 3) {
                    console.error("Unauthorized, refreshing token...");
                    await TokenRefresh();
                    await getUser(retryCount + 1);
                } else if (retryCount >= 3) {
                    console.error("Failed to refresh token after 3 attempts");
                } else {
                    console.error("Server responded with status:", response.status);
                }
            } catch (err) {
                console.error(err);
            }
        }
    
        getUser();
    }, []);

    return (
        <>
            <header className="header">
                <div className="title">
                    <h1>ChatHub</h1>
                </div>
                <div className="buttons">
                    <Link to={"/"}><button id="logoutButton" onClick={handleLogout}>
                        Logout
                    </button>
                    </Link>

                    <Link to="/main">
                        <button id="mainPageButton">Main Page</button>
                    </Link>

                </div>
            </header>

            <main>
                <h1>Profile</h1>
                <div id="profile-box" className="profile-container">
                    <ProfilePictureChanger />
                    <p>Click photo to change profile picture</p>
                    <p>Your name</p>
                    {/*make maxium status length 20 characters*/}
                    <h2>{username}</h2>
                    <p>user id: {userId}</p>
                    <p>Status</p>
                    {/*make maxium status length 40 characters*/}
                    <StatusChanger username={username} />
                </div>


            </main>
        </>

    )
}