import React, { useState, useEffect } from 'react';
import Message from './Message';
import { useParams } from 'react-router-dom';
import { fetchMessages } from '../functions/fetchMessages';

export default function Messages() {
    const { utid } = useParams();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([]);
        fetchMessages(utid, setMessages);
        const intervalId = setInterval(() => fetchMessages(utid, setMessages), 3000);
        return () => clearInterval(intervalId);
    }, [utid]);

    return (
        <div id={"allMessages"}>
            {messages.map(message => {
                return <Message text={message.content[0]} time={message.info.sent} key={message.umid} sender={message.author} files={message.info.attatchments} />;
            })}
        </div>
    );
};