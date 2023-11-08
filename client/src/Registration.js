import './Registration.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';
import HomePage from './HomePage';
import axios from 'axios';
import { Link } from 'react-router-dom';
const api = "http://localhost:5001"

function RegistrationPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');

    //send user register information to backend
    //depending on response, user already exists (change h3 id='resolve')
    //user does not exist --> create user --> (change h3 id='resolve') -->
    //go back to mainpage
    async function registeruser() {
        
        try {
            //first check that user input all data fields
            if (!username || !password || !email) {
                setRegistrationStatus('All fields are required.');
                return;
            }

            //usser has entered all fields
            //prepare data to send to the backend
            const userData = {
                name: username,
                password: password,
                email: email,
            };
            console.log(userData);
            const response = await axios.post(`http://localhost:5001/users/register`, userData);

            console.log(response);

            if (response.status === 200) {
                setRegistrationStatus('Registration successful! Please return to homepage')
            }
            else {
                setRegistrationStatus('Uh-oh, registration failed. There is already a user with this username or email.');
            }
        }
        catch (error) {
            console.error('Axios Error', error);
            setRegistrationStatus('Newtowrk error');
        }
    }
        


    return (
        <body>
            <title>Registration Page</title>
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
            <h1>Your Current Track...<br></br></h1>
            <h2>Register:</h2>
            <div id='input-container'>
                <div id='form-container'>
                <h3 id='resolve'>{registrationStatus}</h3>
                    <div class='input-group'>
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)}></input>
                    </div>
                    <div class='input-group'>
                        <label for="password">Password</label>
                        <input type="text" id="password" name="password"
                        placeholder='letters, numbers, a special character' onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <div class ='input-group'>
                        <label for="email">Email</label>
                        <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div class='buttons'>
                        <button type="button" onClick={registeruser}>Register</button>
                    </div>
                    <div class ='buttons'>
                        <button type="button"><Link to="/onTrack">Login</Link></button>
                    </div>
                </div>
            </div>
        </body>

    );

}

export default RegistrationPage;