import React, {useEffect, useState} from 'react';
import Thread from './Thread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import CreateThread from "../functions/CreateThread";
import { getUser } from "../functions/getUser";

export default function Threads() {
    const [threadsData, setThreadsData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredThreads, setFilteredThreads] = useState(threadsData);
    const [showAddPeople, setShowAddPeople] = useState(false);

    const addThread = (newThread) => {
        setThreadsData(prevThreads => [...prevThreads, newThread]);
    }

    const handleSearch = (searchQuery) => {
        setSearchText(searchQuery);
        const filtered = threadsData.filter(thread =>
            thread.title.toLowerCase().includes(searchQuery.toLowerCase())
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

    useEffect(() => {
        getUser(setThreadsData);
    }, []);

    useEffect(() => {
        setFilteredThreads(threadsData);
    }, [threadsData]);

    return (
      <div id={"threads-container"}>
          <div className="user-searchbox">
              <div id={"text-and-search-container"}>
                    <textarea id={"text-area-in-threads"}
                            type="text"
                            placeholder="Search by thread"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            onKeyPress= {handleKeyPress}
                    />
                    <button id={"search-button-in-threads"} onClick={() => handleSearch(searchText)}> <FontAwesomeIcon icon={faMagnifyingGlass} size={"xl"}/> </button>
              </div>
              <button onClick={toggleAddPeople}> <FontAwesomeIcon icon={faUserPlus} size={"xl"}/> </button>
          </div>
              { showAddPeople
                  ? (<div><CreateThread addThread={addThread}/></div>)
                  : (
                      <div id={"my-threads"}>
                          <h1>My Threads</h1>
                          {filteredThreads.map(thread => (
                              <Thread title={thread.title} key={thread.utid} owner={thread.options.owner} utid={thread.utid} setThreadsData={setThreadsData}/>
                          ))}
                      </div>
                  )}
        </div>);}

