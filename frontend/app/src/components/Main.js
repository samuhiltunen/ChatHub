import React from 'react';
import { Link } from 'react-router-dom';
import Threads from './Threads';
import '../css/main.css';

export default function Main() {
    return (
        <>
            <header className="header">
                <div className="title">
                    <h1>ChatHub</h1>
                </div>
                <div className="buttons">
                    <Link to="/">
                        <button id="logoutButton">
                            Logout
                        </button>
                    </Link>
                    <Link to="/profile">
                        <button id="profileButton">View Profile</button>
                    </Link>
                </div>
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
                    <div className='thread-controls-container'>
                        <button>Create thread</button>
                        <button>Create Group</button>
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
    );
}
