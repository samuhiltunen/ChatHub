import React from 'react'
import '../css/main.css';

export default function Message(props) {
    const username = localStorage.getItem('username');
  return (
    <div className='message-container'  id={props.sender === username ? 'SentByMeTrue':''} >
        <p>{props.text}</p>
        <p>{props.time}</p>
        <p>{props.sender}</p>
    </div>
  )
}
