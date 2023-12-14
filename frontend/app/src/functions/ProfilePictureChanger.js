import React, { useState, useRef, useEffect } from 'react';
import { TokenRefresh } from './TokenRefresh';

const ProfilePictureChanger = ({ setAvatar, avatar }) => {
  const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";
  const [profilePicture, setProfilePicture] = useState(avatar || defaultAvatar);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setProfilePicture(avatar || defaultAvatar);
  }, [avatar]);

  const uploadFile = async (file, retryCount = 0) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const fileOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    };

    delete fileOptions.headers['Content-Type'];

    try {
      const response = await fetch('https://file.chathub.kontra.tel/files', fileOptions);
      const data = await response.json();
      if (!response.ok) {
        console.log("Error uploading file: ", response.status);
      }
      if (response.ok) {
        console.log("/file/uploaded ", response.status);
        return data.content.path;
      } else if (response.status === 401 && retryCount < 3) {
        console.error("Unauthorized, refreshing token...");
        await TokenRefresh();
        await uploadFile(file, retryCount + 1);
      } else if (retryCount >= 3) {
        console.error("Failed to refresh token after 3 attempts");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const newAvatar = await uploadFile(file);
    setProfilePicture(`https://${newAvatar}`);
    setAvatar(`https://${newAvatar}`);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <div>
        <img
          src={`${profilePicture}?${Date.now()}`}
          alt="Click this to add a profile picture" 
          className="avatar"
          id="profile-photo"
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default ProfilePictureChanger;