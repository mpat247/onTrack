import React, { useState } from 'react';
//import UserDetailsForm from './UserDetailsForm'; // Import the UserDetailsForm component
import './EditUserDetails.css';
import onTrackLogo from './onTrackLogo.png';
import HomePage from './HomePage';
import axios from 'axios';
import { Link } from 'react-router-dom';
const api = "http://localhost:5001"

//similar to the registration page
//this is the page the user is redirected to when they click edit user from the homepage
//the interface will be similar to the registration page where they will fill out their
//desired username and password again
//due to time constraints, the person is only able to change their username and password, not the email

const userData = localStorage.getItem('storageName');
const userID = localStorage.getItem('storage2');


function openEditUserPopup() {
  const [showEditUserPopup, setShowEditUserPopup] = useState(false);
  
  const [editUserData, setEditUserData] = useState({
    username: '', // Add other user details fields here
    email: '',
    // Add other fields as needed
  });
  // Initialize the editUserData state with the current user details
  setEditUserData({
    username: userData, // Set the initial value to the current user's data
    email: userEmail, // Replace with the actual variable holding user's email
    // Set other fields as needed
  });

  setShowEditUserPopup(true);
}

async function saveEditedUser() {
  try {
    // Make an HTTP request to update user details on the server
    const response = await axios.put(`http://localhost:5001/users/${userID}`, editUserData);

    if (response.status === 200) {
      console.log('User details updated successfully');
      // Optionally, you can update the user details displayed on the page with the updated data
      // Replace the data accordingly
      setUserData(editUserData.username);
      setUserEmail(editUserData.email);

      setShowEditUserPopup(false); // Close the edit user details pop-up
    }
  } catch (error) {
    console.error('Error saving edited user details:', error);
  }
}

const renderEditUserPopup = () => {
  if (!showEditUserPopup) return null;

  return (
    <div className="user-popup-overlay">
      <div className="user-popup">
        <div className="user-card">
          <h2>Edit User Details</h2>
          <div className="user-inputs">
            <input
              type="text"
              placeholder="Username"
              value={editUserData.username}
              onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
            />
            <input
              type="text"
              placeholder="Email"
              value={editUserData.email}
              onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
            />
            {/* Add other input fields for user details as needed */}
          </div>
          <div className="user-actions">
            <button onClick={saveEditedUser}>Save</button>
            <button onClick={() => setShowEditUserPopup(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};




const UserProfilePage = () => {
  const handleSubmit = (data) => {
    // Handle form submission data here
    console.log('Form data:', data);
    //perform actions to call API to update information
    
  };

  return (
    <body>
      <title>Editing User Details</title>
      <header>
        <div className="wave-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#79addc" fillOpacity="1" d="M0,320L60,304C120,288,240,256,360,229.3C480,203,600,181,720,176C840,171,960,181,1080,181.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
        <div id="logo-container">
          <a href="http://localhost:3000/HomePage">
            <img src={onTrackLogo} id="logo" alt="Logo" />
          </a>
          <button className="view-mode-button" onClick={() => setViewMode('calendar')}>Calendar View</button>
          <button className="view-mode-button" onClick={() => setViewMode('list')}>List View</button>
          <Link to="/homepage"><button className="view-mode-button">
    <i className="fas fa-home" style={{ color: 'white' }}></i>
</button></Link>



        </div>
      </header>
      <div className="center-container">
        <h1>Your Current Track...</h1>
        <h2>Edit Your User Details:</h2>

        {/* Include the UserDetailsForm component */}
      </div>
    </body>
  );
};

export default UserProfilePage;

//        <UserDetailsForm onSubmit={handleSubmit} />
