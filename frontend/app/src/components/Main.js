import React, { useEffect, useState, useRef } from 'react';
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
    const [uploadedFileId, setUploadedFileId] = useState(null);
    const fileInput = useRef(null);
    const [file, setFile] = useState(null);
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async (retryCount = 0) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        const fileOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        };

        delete fileOptions.headers['Content-Type'];

        try {
            console.log(fileOptions);
            const response = await fetch('https://file.chathub.kontra.tel/files', fileOptions);
            const data = await response.json();
            if (!response.ok) {
                console.log("Error uploading file: ", response.status);
            }
            if (response.ok) {
                console.log("/file/uploaded ", response.status);
                console.log(data.content.path);
                setUploadedFileId(data.content.path);
                return data.content.path;
            } else if (response.status === 401 && retryCount < 3) {
                console.error("Unauthorized, refreshing token...");
                await TokenRefresh();
                await uploadFile(retryCount + 1);
            } else if (retryCount >= 3) {
                console.error("Failed to refresh token after 3 attempts");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const createMessage = async (uploadedFileId, retryCount = 0) => {
        const token = localStorage.getItem('token');

        const messageData = {
            utid: utid,
            content: messageContent,
            attachments: uploadedFileId ? [uploadedFileId] : []
        };

        const messageOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(messageData)
        };

        try {
            console.log("/create");
            const response = await fetch(`https://api.chathub.kontra.tel/messages/create`, messageOptions);
            if (response.ok) {
                console.log("/message/create ", response.status);
                setUploadedFileId(null);
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
        let uploadedFileId = null;
        if (file) {
            uploadedFileId = await uploadFile();
            setFile(null);
        }
        await createMessage(uploadedFileId);
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