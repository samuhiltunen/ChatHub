import React from 'react';
import "../css/main.css";
import { Link } from 'react-router-dom';
import Threads from './Threads';

export default function Main() {
    return (
        <>
            <header className="header">
                <div className="title">
                    <h1>ChatHub</h1>
                </div>
                <div className="buttons">
                    <Link to={"/"}><button id="logoutButton" onclick="location.href='landing.html'">
                        Logout
                    </button>
                    <Link to="/profile">
                    <button id="profileButton">View Profile</button>
                    </Link>
            </header>
            <section>
                <aside>
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
                <main>
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

    )
}
