import React, { useEffect, useState } from 'react';
import "../css/main.css";
import { Link } from 'react-router-dom';
import Threads from './Threads';
import { useNavigate } from 'react-router-dom';

export default function Main() {
    const [asideVisible, setAsideVisible] = useState(true);
    const [mainVisible, setMainVisible] = useState(true)
    const navigate = useNavigate();

    const toggleAside = () => {
        setAsideVisible(!asideVisible);
        setMainVisible(!mainVisible);
        console.log(asideVisible)
    };

    const logOutRoute = "https://auth.chathub.kontra.tel/logout"

    const handleLogout = async (e) => {
        e.preventDefault();

        const options = {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
          };

        try {
            const response = await fetch(logOutRoute, options);
            if (response.ok) {
                localStorage.removeItem('token');
                navigate("/");
                console.log(response.status);
                console.log("logged out");
            } else {
                console.error("Server responded with status:", response.status);
            }
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setAsideVisible(true);
                setMainVisible(true);
            } else {
                setAsideVisible(false);

            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <>
            <header className="header">
                <button className="hamburger-icon" onClick={toggleAside}>
                    ☰
                </button>
                <div className="title">
                    <h1>ChatHub</h1>
                </div>
                <div className="buttons">
                    <button id="logoutButton" onClick={handleLogout}>Logout</button>
                    <Link to="/profile">
                        <button id="profileButton">View Profile</button>
                    </Link>
                </div>
            </header>
            <section>
                <aside className={asideVisible ? 'show-aside' : 'hide-aside'}>
                    <div className="user-searchbox">
                        <input
                            type="text"
                            id="username-search"
                            placeholder="search by username"
                        />
                        <button className="searchButton">Search</button>
                    </div>
                    <h1>My Threads</h1>
                    <Threads />
                </aside>
                <main className={mainVisible ? null : 'hide-main'}>
                    <div id="chat" className="chat-container">
                        {/* Chat messages go here */}
                    </div>
                    {/* Input area for typing messages */}
                    <div className="messagebox">
                        <input type="text" id="messageInput" placeholder="Type your message" />
                        <button id="sendMessageButton">Send</button>
                    </div>
                </main>
            </section>
        </>
    );
}
