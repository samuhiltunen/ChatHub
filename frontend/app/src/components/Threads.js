import React, {useEffect, useState} from 'react';
import Thread from './Thread';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import CreateThread from "./CreateThread";
import { TokenRefresh } from './TokenRefresh';


export default function Threads() {
    const [threadsData, setThreadsData] = useState([]);
    let token = localStorage.getItem('token');

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
        if (!uuid) {
            return;
        }
        try {
            const response = await fetch(`https://api.chathub.kontra.tel/threads/a?members=${uuid}`, threadOptions);
            const data = await response.json();
            if (response.ok) {
                setThreadsData(data.content);
            } else if (response.status === 401 && retryCount < 3) {
                console.error("Unauthorized, refreshing token...");
                await TokenRefresh();
                token = localStorage.getItem('token');
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
                if (data.content.uuid) {
                    getThreads(data.content.uuid);
                } else {
                    console.log('User UUID is undefined');
                }
            } else if (response.status === 401 && retryCount < 3) {
                console.error("Unauthorized, refreshing token...");
                await TokenRefresh();
                token = localStorage.getItem('token');
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
        getUser();
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

