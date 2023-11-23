import React from 'react';
import Message from './Message';

// TODO: Data from backend
const messages = [{
    id: 1,
    text: "Test Message",
    time: "20.11 klo 12.25"
}, {
    id : 2,
    text: "Test Message2",
    time: "20.11 klo 12.25"
}, {
    id: 3,
    text: "Test Message3",
    time: "20.11 klo 12.25"
}
];

export default function Messages() {
    return (
      <div>
          {messages.map(message => {
              return <Message text={message.text} time={message.time} key={message.id} />;
          })}
      </div>
    )
  };
