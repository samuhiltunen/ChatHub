import React from 'react'
import '../css/message.css';

export default function Message(props) {
  return (
    <div className='message-container'>
        <p>{props.text}</p>
        <p>{props.time}</p>
    </div>
  )
}
