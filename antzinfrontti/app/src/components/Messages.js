import React from 'react';
import Message from './Message';

// TODO: Data from backend
const messages = [{
    id: 1,
    text: "Test Message",
    time: "20.11 klo 12.25",
    sender:"userA"
}, {
    id : 2,
    text: "Test Message2",
    time: "20.11 klo 12.25",
    sender: "test3"
}, {
    id: 3,
    text: "Test Message3",
    time: "20.11 klo 12.25",
    sender: "UserA"
}
];

export default function Messages() {
    return (
      <div id={"allMessages"}>
          {messages.map(message => {
              return <Message text={message.text} time={message.time} key={message.id} sender={message.sender.toLowerCase()} />;
          })}
      </div>
    )
  };
