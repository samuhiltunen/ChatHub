import React, {useState} from 'react';
import Thread from './Thread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import CreateThread from "./CreateThread";

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
    const [showAddPeople, setShowAddPeople] = useState(false);

    const handleSearch = (searchQuery) => {
        setSearchText(searchQuery);
        const filtered = threadsData.filter(thread =>
            thread.user.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredThreads(filtered);
    };


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch(searchText);
        }
    };

    const toggleAddPeople = () => {
        setShowAddPeople(!showAddPeople);
    };

    return (
      <div id={"threads-container"}>
          <div className="user-searchbox">
              <textarea
                  type="text"
                  id="username-search"
                  placeholder="search by username"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress= {handleKeyPress}
              />
              <div id={"userSearchButtons"}>
              <button onClick={() => handleSearch(searchText)}> <FontAwesomeIcon icon={faMagnifyingGlass}/> </button>
              <button onClick={toggleAddPeople}> <FontAwesomeIcon icon={faUserPlus}/> </button>
              </div>
          </div>

              { showAddPeople
                  ? (<div><CreateThread/></div>)
                  : (
                      <div>
                          <h1>My Threads</h1>
                          {filteredThreads.map(thread => (
                              <Thread user={thread.user} time={thread.time} key={thread.id} />
                          ))}
                      </div>
                  )}
        </div>);}

