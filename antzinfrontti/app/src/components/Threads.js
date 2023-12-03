import React from 'react';
import Thread from './Thread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

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
      <div id={"vittu"}>
          <div className="user-searchbox">
              <textarea
                  type="text"
                  id="username-search"
                  placeholder="search by username"
              />
              <div id={"userSearchButtons"}>
              <button> <FontAwesomeIcon icon={faMagnifyingGlass}/> </button>
              <button> <FontAwesomeIcon icon={faUserPlus}/> </button>
              </div>
          </div>
          <h1>My Threads</h1>
          {threads.map(thread => {
              return <Thread user={thread.user} time={thread.time} key={thread.id} />;
          })}
      </div>
    )
  };
