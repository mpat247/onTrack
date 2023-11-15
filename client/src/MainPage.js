import './MainPage.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';
import axios from 'axios'; // Import Axios
import Homepage from './HomePage'; // Import the Homepage component
import { Link } from 'react-router-dom';
const api = "http://localhost:5001"

function MainPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const [code, setCode] = useState(''); // State for the code input
  const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility
  var newName = '';


  const handleLogin = async () => {
    try {
      console.log(username, password);
      const response = await axios.get(`http://localhost:5001/users/${username}/${password}`);
      if (response.status === 200) {
        setShowPopup(true); // Show the popup for additional verification
        newName = response.data.payload.username
        
      } else if (response.status === 404) {
        console.log('User not found');
        setLoginStatus('User not found');
      } else {
        console.log('Server error');
        setLoginStatus('Server error');
      }
    } catch (error) {
      console.error('Axios error:', error);
      setLoginStatus('Network error');
    }
  };

  const handleCodeVerification = async () => {
    try {
      console.log(code);
      const response = await axios.get(`http://localhost:5001/users/auth/${username}/${code}`);
      if (response.status === 200) {
        const userData = newName;
        
        //window.location.href = `http://localhost/homepage`;
        localStorage.setItem('storageName', userData);
        window.location = `http://localhost:3000/homepage`;

      } else if (response.status === 404) {
        console.log('Code not valid');
        setLoginStatus('Code not valid');
      } else {
        console.log('Server error');
        setLoginStatus('Server error');
      }
    } catch (error) {
      console.error('Axios error:', error);
      setLoginStatus('Network error');
    } 
  };


  return (

    <body>
      <header>
          <div class="wave-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path 
          fill="#79addc" fill-opacity="1" d="M0,320L60,304C120,288,240,256,360,229.3C480,203,600,181,720,176C840,171,960,181,1080,181.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
          </div>
         <div id='logo-container'> 
          <img src={onTrackLogo} id='logo' alt="Logo" />
          <div id='title'>onTrack</div>
         </div>
      </header>
      <div id='input-container'>
        <div id='form-container'>
          <div class='input-group'>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)}></input>
          </div>
          <div class='input-group'>
          <label for="password">Password</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
          </div>
          <div class='buttons'>
            <button type="button" onClick={handleLogin}>Login</button>
          </div>
          <div class='buttons'>
            <button type="button"><Link to="/forgotpassword">Forgot Password</Link></button>
          </div>
          <div class='buttons'>
            <button type="button"><Link to="/registerpage">Register</Link></button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div id='popup-container'>
          <div id='popup-card'>
            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              name="code"
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="button" onClick={handleCodeVerification}>Verify Code</button>
          </div>
        </div>
      )}
  </body>
  
  
    
  );
}

export default MainPage;
