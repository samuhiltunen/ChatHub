import React, { useState } from 'react';

const StatusChanger = ({ status, setStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newStatus, setNewStatus] = useState(status);

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
        <div>
            {isEditing ? (
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        value={newStatus}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <h2>{status}</h2>
                    <button onClick={handleButtonClick}>Change status</button>
                </div>
            )}
        </div>
    );
};

export default StatusChanger;