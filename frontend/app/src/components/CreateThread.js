import React, { useState } from 'react'
import "../css/main.css";
import { TokenRefresh } from './TokenRefresh';

export default function CreateThread(props) {

    const [title, setTitle] = useState("");
    const [memberInput, setMemberInput] = useState("");
    const [members, setMembers] = useState([]);
    const [moderatorInput, setModeratorInput] = useState("");
    const [moderators, setModerators] = useState([]);
    const [nsfw, setNsfw] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "title": title,
                "members": members,
                "moderators": moderators,
                "nsfw": nsfw
            })
        };

        try {
            const response = await fetch('https://api.chathub.kontra.tel/threads/create', options);
            if (response.ok) {
                console.log("Thread OK");
                const responseData = await response.json();
                props.addThread(responseData.content.thread);

            } else {
                if (response.status === 401) {
                    console.error("Unauthorized, refreshing token...");
                    TokenRefresh();
                }
                console.error("/Create Thread, Server responded with status:", response.status);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const addMember = () => {
        setMembers(prevMembers => [...prevMembers, memberInput]);
        setMemberInput("");
    }

    const addModerator = () => {
        setModerators(prevModerators => [...prevModerators, moderatorInput]);
        setModeratorInput("");
    }

    return (
        <>
            <div className="create-thread">
                <div className="create-thread-container">
                    <h2>Create Thread</h2>
                    <form id='create-thread-form' onSubmit={handleSubmit}>
                        <label htmlFor="title" style={{ color: 'black' }}>Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />

                        <label htmlFor="members" style={{ color: 'black' }}>Members</label>
                        <input type="text" id="members" value={memberInput} onChange={e => setMemberInput(e.target.value)} placeholder="Add a member" />
                        <button type="button" onClick={addMember}>Add member(userid)</button>
                        <p style={{ color: 'black' }}>Members</p>
                        <ul>
                            {members.map((member, index) => <li key={index} style={{ color: 'black', backgroundColor: 'white' }}>{member}</li>)}
                        </ul>

                        <label htmlFor="moderators" style={{ color: 'black' }}>Moderators</label>
                        <input type="text" id="moderators" value={moderatorInput} onChange={e => setModeratorInput(e.target.value)} placeholder="Add a moderator" />
                        <button type="button" onClick={addModerator}>Add moderator (user id)</button>
                        <p style={{ color: 'black' }}>Moderators</p>
                        <ul>
                            {moderators.map((moderator, index) => <li key={index} style={{ color: 'black', backgroundColor: 'white' }}>{moderator}</li>)}
                        </ul>

                        <label htmlFor="nsfw" style={{ color: 'black' }}>NSFW</label>
                        <input type="checkbox" id="nsfw" checked={nsfw} onChange={e => setNsfw(e.target.checked)} />

                        <button type="submit">Create Thread</button>
                    </form>
                </div>
            </div>
        </>
    )
}