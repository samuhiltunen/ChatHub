import React, { useState, useEffect } from 'react';
import Message from './Message';
import { useParams } from 'react-router-dom';
import { TokenRefresh } from './TokenRefresh';

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
    
        const fetchMessages = async (retryCount = 0) => {
            if (!utid) {
                return;
            }
            try {
                console.log("/messages/get", utid);
                const response = await fetch(`https://api.chathub.kontra.tel/messages/get?utid=${utid}&amnt=50`, messageOptions);
                if (response.status === 401) {
                    console.error("Unauthorized, refreshing token...");
                    await TokenRefresh();
                    if (retryCount < 3) { 
                        await fetchMessages(retryCount + 1);
                    } else {
                        console.error("Failed to refresh token after 3 attempts");
                    }
                } else if (!response.ok) {
                    console.error("/messages/get responded with status:", response.status);
                    return;
                }
                const data = await response.json();
            
                setMessages(data.content.sort((a, b) => new Date(a.info.sent) - new Date(b.info.sent)));
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchMessages();  
    
        const intervalId = setInterval(fetchMessages, 3000); 
    
        return () => clearInterval(intervalId);  
    }, [utid]);

    return (
        <div id={"allMessages"}>
            {messages.map(message => {
                return <Message text={message.content[0]} time={message.info.sent} key={message.umid} sender = {message.author}/>;
            })}
        </div>
    );
};