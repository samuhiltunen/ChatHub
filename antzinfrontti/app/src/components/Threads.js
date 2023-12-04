import React, {useState} from 'react';
import Thread from './Thread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

// TODO: Data from backend
const threadsData = [{
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

    const [searchText, setSearchText] = useState('');
    const [filteredThreads, setFilteredThreads] = useState(threadsData);

    const handleSearch = () => {
        const filtered = threadsData.filter(thread =>
            thread.user.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredThreads(filtered);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
      <div id={"vittu"}>
          <div className="user-searchbox">
              <textarea
                  type="text"
                  id="username-search"
                  placeholder="search by username"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={handleKeyPress}
              />
              <div id={"userSearchButtons"}>
              <button onClick={handleSearch}> <FontAwesomeIcon icon={faMagnifyingGlass}/> </button>
              <button> <FontAwesomeIcon icon={faUserPlus}/> </button>
              </div>
          </div>
          <h1>My Threads</h1>
          {filteredThreads.map(thread => {
              return <Thread user={thread.user} time={thread.time} key={thread.id} />;
          })}
      </div>
    )
  };
