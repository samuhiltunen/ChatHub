import React, {useEffect, useState} from 'react';
import Thread from './Thread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import CreateThread from "./CreateThread";
import { TokenRefresh } from './TokenRefresh';


export default function Threads() {
    const [threadsData, setThreadsData] = useState([]);
    const token = localStorage.getItem('token');

    const [searchText, setSearchText] = useState('');
    const [filteredThreads, setFilteredThreads] = useState(threadsData);
    const [showAddPeople, setShowAddPeople] = useState(false);

    const threadOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
    };

    const addThread = (newThread) => {
        setThreadsData(prevThreads => [...prevThreads, newThread]);
    }

    const getThreads = async (uuid, retryCount = 0) => {
        try {
            const response = await fetch(`https://api.chathub.kontra.tel/threads/a?members=${uuid}`, threadOptions);
            const data = await response.json();
            if (response.ok) {
                setThreadsData(data.content);
            } else if (response.status === 401 && retryCount < 3) {
                console.error("Unauthorized, refreshing token...");
                await TokenRefresh();
                await getThreads(uuid, retryCount + 1);
            } else if (retryCount >= 3) {
                console.error("Failed to refresh token after 3 attempts");
            } else {
                console.error("Server responded with status:", response.status);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getUser = async (retryCount = 0) => {
        const userOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    
        try {
            const response = await fetch(`https://api.chathub.kontra.tel/users/get`, userOptions);
            const data = await response.json();
            if (response.ok) {
                getThreads(data.content.uuid);
            } else if (response.status === 401 && retryCount < 3) {
                console.error("Unauthorized, refreshing token...");
                await TokenRefresh();
                await getUser(retryCount + 1);
            } else if (retryCount >= 3) {
                console.error("Failed to refresh token after 3 attempts");
            } else {
                console.error("Server responded with status:", response.status);
            }
        } catch (err) {
            console.error(err);
        }
    };
    

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


    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        setFilteredThreads(threadsData);
    }, [threadsData]);

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
                  ? (<div><CreateThread addThread={addThread}/></div>)
                  : (
                      <div>
                          <h1>My Threads</h1>
                          {filteredThreads.map(thread => (
                              <Thread title={thread.title} key={thread.utid} owner={thread.options.owner} utid={thread.utid}/>
                          ))}
                      </div>
                  )}
        </div>);}

