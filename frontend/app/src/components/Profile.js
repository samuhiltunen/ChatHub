import React, { useEffect, useState, useRef } from 'react';
import "../css/main.css";
import "../css/profile.css";
import { Link } from 'react-router-dom';
import ProfilePictureChanger from './ProfilePictureChanger';
import { Logout } from './Logout';
import { TokenRefresh } from './TokenRefresh';
import StatusChanger from './StatusChanger';
import BioChanger from './BioChanger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowLeft, faLock, faRightFromBracket, faUser, faIdCard} from '@fortawesome/free-solid-svg-icons'

export default function Profile() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState('');
    const [status, setStatus] = useState('Hello, My name is TestUser!');
    const [bio, setBio] = useState('This is my bio');
    const [avatar, setAvatar] = useState('');
    const handleLogout = Logout();
    const isLoaded = useRef({update:false});

    useEffect(() => {
        let token = localStorage.getItem('token');
        const updateUser = async (retryCount = 0) => {
            if (!userId || !username || typeof status !== 'string' || typeof bio !== 'string') {
                return;
            }

            // Check if all data is loaded
            if (!isLoaded.current.update) {
                isLoaded.current.update = true;
                return;
            }

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
                            bio: bio,
                            avatar: avatar
                        }
                    }
                })
            };

            try {
                const response = await fetch('https://api.chathub.kontra.tel/users/update', options);
                if (!response.ok) {
                    if (response.status === 401 && retryCount < 3) {
                        console.error("Unauthorized, refreshing token...");
                        await TokenRefresh();
                        token = localStorage.getItem('token');
                        await updateUser(retryCount + 1);
                    } else if (retryCount >= 3) {
                        console.error("Failed to refresh token after 3 attempts");
                    } else {
                        throw new Error(`Server responded with status: ${response.status}`);
                    }
                } else {
                    console.log("User updated");
                }
            } catch (err) {
                console.error(err);
            }
        };

        updateUser();
    }, [status, bio, avatar]);

    useEffect(() => {
        console.log("Getting user...");
        let token = localStorage.getItem('token');

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
                    setUsername(data.content.name);
                    setUserId(data.content.uuid);
                    setStatus(data.content.info.status);
                    setBio(data.content.info.bio);
                    setAvatar(data.content.info.avatar);
                    console.log("User data loaded");
                } else if (response.status === 401 && retryCount < 3) {
                    console.error("Unauthorized, refreshing token...");
                    await TokenRefresh();
                    token = localStorage.getItem('token');
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
                    <button id="mainPageButton"><FontAwesomeIcon icon={faArrowLeft} size={"3x"}/></button>
                </Link>
                <div className="title">
                    <h1>ChatHub</h1>
                </div>
                <div className="buttons">
                    <Link to={"/"}><button id="logoutButton" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} size={"3x"}></FontAwesomeIcon>
                    </button>
                    </Link>
                </div>
            </header>

            <main id={"profile-main"}>

                <div id="profile-box" className="profile-container">

                    <h1>Profile</h1>
                    <ProfilePictureChanger setAvatar={setAvatar} avatar={avatar}/>
                    <p id={"vittu"}>Click photo to change profile picture</p>

                    <div>
                        <h2>Username: {username}</h2>
                        <h2>User id: {userId}</h2>
                    </div>
                    <div className={"form-input-container"}>
                        <FontAwesomeIcon icon={faUser} size={"2x"}></FontAwesomeIcon>
                        <input
                            placeholder={"Username: "}

                        />
                    </div>
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
