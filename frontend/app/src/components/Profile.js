import React, { useEffect, useState } from 'react';
import "../css/main.css";
import { Link } from 'react-router-dom';
import "../css/profile.css";
import ProfilePictureChanger from './TestPhoto';
import { Logout } from './Logout';
import { TokenRefresh } from './TokenRefresh';

const StatusChanger = ({ status, setStatus }) => {
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
const BioChanger = ({ bio, setBio }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBio, setNewBio] = useState(bio);

    const handleButtonClick = () => {
        setIsEditing(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setBio(newBio);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setNewBio(e.target.value);
    };

    return (
        <div>
            {isEditing ? (
                <form onSubmit={handleFormSubmit}>
                    <textarea
                        value={newBio}
                        onChange={handleInputChange}
                        rows="4" 
                        cols="50"
                    />
                    <br />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <h2>{bio}</h2>
                    <button onClick={handleButtonClick}>Change Bio</button>
                </div>
            )}
        </div>
    );
};

export default function Profile() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('Hello, My name is TestUser!');
    const [bio, setBio] = useState('This is my bio');
    const handleLogout = Logout();

    useEffect(() => {
        const token = localStorage.getItem('token');

        const updateUser = async (retryCount = 0) => {
            const options = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uuid: userId,
                    user: {
                        name: username,
                        info: {
                            status: status,
                            bio: bio
                        }
                    }
                })
            };

            try {
                console.log('updating user');
                const response = await fetch('https://api.chathub.kontra.tel/users/update', options);
                if (!response.ok) {
                    if (response.status === 401 && retryCount < 3) {
                        console.error("Unauthorized, refreshing token...");
                        await TokenRefresh();
                        await updateUser(retryCount + 1);
                    } else if (retryCount >= 3) {
                        console.error("Failed to refresh token after 3 attempts");
                    } else {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }
                } else {
                    console.log('user updated');
                    console.log("/updateUser: ", response.status);
                }
            } catch (err) {
                console.error(err);
            }
        };

        updateUser();
    }, [status, bio]);

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
                    setStatus(data.content.info.status);
                    setBio(data.content.info.bio);
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
            <header id={"profile-header"} className="header">
                <Link to="/main">
                    <button id="mainPageButton">Main Page</button>
                </Link>
                <div className="title">
                    <h1>ChatHub</h1>
                </div>
                <div className="buttons">
                    <Link to={"/"}><button id="logoutButton" onClick={handleLogout}>
                        Logout
                    </button>
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
                    <br></br>
                    <p>Status</p>
                    {/*make maxium status length 40 characters*/}
                    <StatusChanger username={username}  setStatus={setStatus} status={status}/>
                    <br></br>
                    <p>Bio</p>
                    {/*make maxium status length 40 characters*/}
                    <BioChanger bio={bio} setBio={setBio}/>
                </div>


            </main>
        </>

    )
}
