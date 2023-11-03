import './MainPage.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';

function MainPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch(`/user/${username}/${password}`);
      if (response.status === 200) {
        const userData = await response.json();
        console.log('User found:', userData);
        setLoginStatus('Success');
      } else if (response.status === 404) {
        console.log('User not found');
        setLoginStatus('User not found');
      } else {
        console.log('Server error');
        setLoginStatus('Server error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
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
            <input type="text" id="password" name="password" onChange={(e) => setPassword(e.target.value)}></input>
          </div>
          <div class='buttons'>
            <button type="button" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>

  </body>
    
  );
}

export default MainPage;
