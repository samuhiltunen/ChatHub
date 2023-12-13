import React, { useState, useEffect } from "react";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BioChanger = ({ bio, setBio }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBio, setNewBio] = useState(bio);

    useEffect(() => {
        setNewBio(bio);
    }, [bio]);

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
                <form className={"change-container"} onSubmit={handleFormSubmit}>
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
                <div className={"change-container"}>
                    <div className={"change-container"} id={"flex-row"}>
                    <FontAwesomeIcon icon={faCircleInfo} size={"2x"}></FontAwesomeIcon>
                    <h2>Bio: {bio}</h2>
                    </div>
                    <button className={"change-button"} onClick={handleButtonClick}>Change Bio</button>
                </div>
            )}
        </div>
    );
};

export default BioChanger;