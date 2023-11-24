import './MainPage.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
const api = "http://localhost:5001"

function MainPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const [code, setCode] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [newName, setNewName] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/users/${username}/${password}`);
      if (response.status === 200) {
        setNewName(response.data.payload.username);
        setUserId(response.data.payload.userId);
        setShowLoginSuccess(true);
      } else {
        setLoginStatus('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginStatus('An error occurred during login.');
    }
  };

  const handleCodeVerification = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/users/auth/${username}/${code}`);
      if (response.status === 200) {
        localStorage.setItem('storageName', newName);
        localStorage.setItem('storage2', userId);
        window.location = `http://localhost:3000/homepage`;
      } else {
        setLoginStatus('Code verification failed.');
      }
    } catch (error) {
      console.error('Code verification error:', error);
      setLoginStatus('An error occurred during code verification.');
    }
  };

  const handleAuthenticate = async () => {
    try {
      // Create an object with the userId property
      const requestBody = { userID: userId };
  
      // Send the request with the correct URL and requestBody
      const response = await axios.put(`http://localhost:5001/users/auth`, requestBody, {
        headers: {
          'Content-Type': 'application/json' // Ensure to set the content type to application/json
        }
      });
  
      if (response.status === 200) {
        setShowLoginSuccess(false);
        setShowPopup(true);
      } else {
        console.log("Failed to trigger code generation");
      }
    } catch (error) {
      console.error('Error triggering code generation:', error);
    }
  };
  
  
  const closePopup = () => {
    setShowPopup(false);
    setShowLoginSuccess(false);
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
        {loginStatus && <div className="error-message">{loginStatus}</div>}
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

      {showLoginSuccess && (
        <div id='popup-container'>
          <div id='popup-card'>
            <h2>Login Successful</h2>
            <button type="button" onClick={handleAuthenticate}>Authenticate</button>
            <button type="button" onClick={closePopup} style={{ backgroundColor: '#79addc', color: 'white' }}>Close</button>
          </div>
        </div>
      )}

      {showPopup && (
        <div id='popup-container'>
          <div id='popup-card'>
            <label htmlFor="code">Code:</label>
            <input type="text" id="code" name="code" onChange={(e) => setCode(e.target.value)} />
            <button type="button" onClick={handleCodeVerification}>Verify Code</button>
            <button type="button" onClick={closePopup} style={{ backgroundColor: '#79addc', color: 'white' }}>Close</button>
          </div>
        </div>
      )}
  </body>
  
  
    
  );
}

export default MainPage;
