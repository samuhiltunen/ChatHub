import React, { useState } from "react";

const BioChanger = ({ bio, setBio }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBio, setNewBio] = useState(bio);

    const handleButtonClick = () => {
        setIsEditing(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setBio(newBio);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setNewBio(e.target.value);
    };

    return (
        <div className={"bio-change-container"}>
            {isEditing ? (
                <form className={"bio-change-container"} onSubmit={handleFormSubmit}>
                    <textarea
                        value={newBio}
                        onChange={handleInputChange}
                        rows="4" 
                        cols="50"
                    />
                    <br />
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div className={"bio-change-container"}>
                    <h2>{bio}</h2>
                    <button onClick={handleButtonClick}>Change Bio</button>
                </div>
            )}
        </div>
    );
};

export default BioChanger;