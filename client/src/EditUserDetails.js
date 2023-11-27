import React, { useState } from 'react';
import UserDetailsForm from './UserDetailsForm'; // Import the UserDetailsForm component
import './EditUser.css';
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

function EditUserDetails() {

}
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path 
            fill="#79addc" fill-opacity="1" d="M0,320L60,304C120,288,240,256,360,229.3C480,203,600,181,720,176C840,171,960,181,1080,181.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
        </div>
        <div id='logo-container'>
          <img src={onTrackLogo} id='logo' alt="Logo" />
          <div id='title'>onTrack</div>
        </div>
      </header>
      <div className="center-container">
        <h1>Your Current Track...</h1>
        <h2>Edit Your User Details:</h2>

        {/* Include the UserDetailsForm component */}
        <UserDetailsForm onSubmit={handleSubmit} />
      </div>
    </body>
  );
};

export default UserProfilePage;
