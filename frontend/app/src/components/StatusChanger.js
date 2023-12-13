import React, { useState, useEffect } from 'react';
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const StatusChanger = ({ status, setStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newStatus, setNewStatus] = useState(status);

    useEffect(() => {
        setNewStatus(status);
    }, [status]);

    const handleButtonClick = () => {
        setIsEditing(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setStatus(newStatus);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setNewStatus(e.target.value);
    };

    return (
        <div className={"change-container"}>
            {isEditing ? (
                <form className={"change-container"} onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        value={newStatus}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div className={"change-container"}>
                    <div className={"change-container"} id={"flex-row"}>
                    <FontAwesomeIcon icon={faStar} size={"2x"}></FontAwesomeIcon>
                    <h2>Status: {status}</h2>
                    </div>
                    <button className={"change-button"} onClick={handleButtonClick}>Change status</button>
                </div>
            )}
        </div>
    );
};

export default StatusChanger;
