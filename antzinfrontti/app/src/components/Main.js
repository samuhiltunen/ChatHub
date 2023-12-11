import React, {useEffect, useState} from 'react';
import "../css/main.css";
import { Link } from 'react-router-dom';
import Threads from './Threads';
import ProfileInAside from "./ProfileInAside";
import Header from "./Header";
import Messages from "./Messages";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export default function Main() {
    const [asideVisible, setAsideVisible] = useState(true);
    const [mainVisible, setMainVisible] = useState(true)

    const toggleAside = () => {
        setAsideVisible(!asideVisible);
        setMainVisible(!mainVisible);
        console.log(asideVisible)
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
                    <ProfileInAside/>
                    {/* if button pressed = true:
                    <AddPeople />*/}
                </aside>
                <main className={mainVisible ? null : 'hide-main'}>
                    <div id="chat" className="chat-container">
                        {/* Chat messages go here */}
                        <Messages/>
                    </div>
                    {/* Input area for typing messages */}
                    <div className="messagebox">
                        <div className={"messagewrap"}>
                            <button><FontAwesomeIcon icon={faPaperclip} size={"lg"} /></button>
                        <textarea  id="messageInput" placeholder="Type your message" />
                        <button ><FontAwesomeIcon icon={faPaperPlane} size={"lg"} /></button>
                            </div>
                    </div>
                </main>
            </section>
        </>
);
}
