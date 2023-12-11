import React, { useState, useEffect } from 'react';
import Message from './Message';
import { useParams } from 'react-router-dom';

export default function Messages() {
    const { utid } = useParams();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const messageOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    
        const fetchMessages = async () => {
            try {
                const response = await fetch(`https://api.chathub.kontra.tel/messages/get?utid=${utid}`, messageOptions);
                const data = await response.json();
                console.log("fetch message data: ",data);
                setMessages(data.content.sort((a, b) => new Date(a.info.sent) - new Date(b.info.sent)));
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchMessages();  // Fetch messages immediately when the component mounts
    
        const intervalId = setInterval(fetchMessages, 3000);  // Fetch messages every 5 seconds
    
        return () => clearInterval(intervalId);  // Clean up the interval when the component unmounts
    }, [utid]);

    return (
        <div id={"allMessages"}>
            {messages.map(message => {
                return <Message text={message.content[0]} time={message.info.sent} key={message.umid} />;
            })}
        </div>
    );
};