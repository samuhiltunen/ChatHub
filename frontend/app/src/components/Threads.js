import React from 'react';
import Thread from './Thread';

// TODO: Data from backend
const threads = [{
    id: 1,
    user: "TestUser",
    time: "20.11 klo 12.25"
}, {
    id: 2,
    user: "TestUser2",
    time: "20.11 klo 12.25"
}, {
    id: 3,
    user: "TestUser3",
    time: "20.11 klo 12.25"
}
];

export default function Threads() {
    return (
      <div>
          {threads.map(thread => {
              return <Thread user={thread.user} time={thread.time} key={thread.id} />;
          })}
      </div>
    )
  };
