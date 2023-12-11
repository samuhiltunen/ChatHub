import React, { useEffect, useState } from 'react';
import "../css/main.css";
import { useParams } from 'react-router-dom';
import Threads from './Threads';
import ProfileInAside from "./ProfileInAside";
import Header from "./Header";
import Messages from "./Messages";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

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
        setMessageContent(event.target.value);  // Update the message content when the textarea value changes
    };

    const createMessage = async () => {
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
            const data = await response.json();
            console.log("createMessage response:");
            console.log(data);  // Log the data here
            if (response.ok) {
                console.log(response.status);
                // If the message was created successfully, you might want to add it to your messages state
                // You might need to move your messages state and setMessages function into this component
               
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendClick = async () => {
        // Call your createMessage function here
        // You might need to move it into this component or import it from another module
        await createMessage(messageContent);
        setMessageContent('');  // Clear the message input after sending
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
                        {/* Chat messages go here */}
                        <Messages />
                    </div>
                    {/* Input area for typing messages */}
                    <div className="messagebox">
                        <div className={"messagewrap"}>
                            <button><FontAwesomeIcon icon={faPaperclip} size={"lg"} /></button>
                            <textarea
                                id="messageInput"
                                placeholder="Type your message"
                                value={messageContent}  // Bind the textarea value to the messageContent state variable
                                onChange={handleMessageChange}  // Update the state when the textarea value changes
                            />
                            <button onClick={handleSendClick}><FontAwesomeIcon icon={faPaperPlane} size={"lg"} /></button>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}
