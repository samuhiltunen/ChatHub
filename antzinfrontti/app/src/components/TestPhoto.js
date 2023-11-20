import React, { useState, useRef } from 'react';

const ProfilePictureChanger = () => {
  const [profilePicture, setProfilePicture] = useState("https://www.w3schools.com/howto/img_avatar.png");

  // Ref for the file input
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleImageClick = () => {
    // Trigger the click event on the file input
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the file input
      />
      <div>
        <img
          src={profilePicture}
          alt="Profile"
          className="avatar" // Use the same class name as before
          id="profile-photo" // Use the same ID as before
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
        />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <ProfilePictureChanger />
    </div>
  );
};

export default App;
