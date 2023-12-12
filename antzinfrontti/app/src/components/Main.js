import React, { useEffect, useState } from 'react';
import "../css/main.css";
import { useParams } from 'react-router-dom';
import Threads from './Threads';
import ProfileInAside from "./ProfileInAside";
import Header from "./Header";
import Messages from "./Messages";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { TokenRefresh } from './TokenRefresh';

export default function Main() {
    const [asideVisible, setAsideVisible] = useState(true);
    const [mainVisible, setMainVisible] = useState(true);
    const [messageContent, setMessageContent] = useState('');
    let utid = useParams();
    utid = utid.utid;

    const toggleAside = () => {
        setAsideVisible(!asideVisible);
        setMainVisible(!mainVisible);
        console.log(asideVisible)
    };

    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    const createMessage = async (retryCount = 0) => {
        const token = localStorage.getItem('token');
        const messageOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ utid: utid, content: messageContent })
        };

        try {
            console.log("/create");
            const response = await fetch(`https://api.chathub.kontra.tel/messages/create`, messageOptions);
            if (response.ok) {
                console.log("/message/create ", response.status);
            } else if (response.status === 401 && retryCount < 3) {
                console.error("Unauthorized, refreshing token...");
                await TokenRefresh();
                await createMessage(retryCount + 1);
            } else if (retryCount >= 3) {
                console.error("Failed to refresh token after 3 attempts");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendClick = async () => {
        await createMessage();
        setMessageContent('');
    };

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
            <Header toggleAside={toggleAside} />
            <section>
                <aside className={asideVisible ? 'show-aside' : 'hide-aside'}>
                    {/* if button pressed = false: */}
                    <Threads />
                    <ProfileInAside />
                    {/* if button pressed = true:
                    <AddPeople />*/}
                </aside>
                <main className={mainVisible ? null : 'hide-main'}>
                    <div id="chat" className="chat-container">
                        <Messages />
                    </div>
                    <div className="messagebox">
                        <div className={"messagewrap"}>
                            <button><FontAwesomeIcon icon={faPaperclip} size={"xl"} /></button>
                            <textarea
                                id="messageInput"
                                placeholder="Type your message"
                                value={messageContent}
                                onChange={handleMessageChange}
                            />
                            <button onClick={handleSendClick}><FontAwesomeIcon icon={faPaperPlane} size={"xl"} /></button>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}
