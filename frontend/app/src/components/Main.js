import React, { useEffect, useState, useRef } from 'react';
import "../css/main.css";
import { useParams } from 'react-router-dom';
import Threads from './Threads';
import ProfileInAside from "../functions/ProfileInAside";
import Header from "./Header";
import Messages from "./Messages";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { uploadFile } from '../functions/uploadFile';
import { createMessage } from '../functions/createMessage';

export default function Main() {
    const [asideVisible, setAsideVisible] = useState(true);
    const [mainVisible, setMainVisible] = useState(true);
    const [messageContent, setMessageContent] = useState('');
    const fileInput = useRef(null);
    const [file, setFile] = useState(null);
    const containerRef = useRef(null);
    let utid = useParams();
    utid = utid.utid;

    const toggleAside = () => {
        setAsideVisible(!asideVisible);
        setMainVisible(!mainVisible);
    };

    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSendClick = async () => {
        let uploadedFileId = null;
        if (file) {
            uploadedFileId = await uploadFile(file);
            setFile(null);
        }
        await createMessage(utid, messageContent, uploadedFileId);
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
                <main className={mainVisible ? null : 'hide-main'}  >
                    <div id="chat" className="chat-container" ref={containerRef}>
                        <Messages />
                    </div>
                    <div className="messagebox">
                        <div className={"messagewrap"}>
                            <input type="file" onChange={handleFileChange} ref={fileInput} style={{ display: 'none' }} />
                            <button onClick={() => fileInput.current && fileInput.current.click()}><FontAwesomeIcon icon={faPaperclip} size={"lg"} /></button>
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