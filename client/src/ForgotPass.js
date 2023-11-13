import './ForgottenPass.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';
import MainPage from './MainPage';
import { Link } from 'react-router-dom';
const api = "http://localhost:5001"

function ForgotPassPage() {

    const [statusString, setStatusString] = useState('');
    const [checkEmail, setCheckEmail] = useState('');

    async function emailExists() {
        try {
            //check that email field is not empty
            if (!checkEmail) {
                setStatusString('Please enter a valid email.');
                return;
            }
            else {
                console.log(checkEmail);
                
                const response = await axios.get(`http://localhost:5001/users/reset`, checkEmail);
                console.log(response);
                if (response.status === 200) {
                    setStatusString('An email has been sent to your inbox. Please check your email for the reset password link.')
                }
                else if (response.status === 404) {
                    setStatusString('This email is not affiliated with any account. Please recheck the inputted email.')
                }
            }
        }
        catch (error) {
            console.error('Error', error);
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
                <div>
                    <h3 id='resolve'>{statusString}</h3>
                </div>
                <div class='input-group'>
                    <h3>Please enter your email for your account<br></br></h3>
                    <input type="text" id="emailtext" name="emailtext" onChange={(e) => setCheckEmail(e.target.value)}></input>
                </div>
                <div class='buttons'>
                    <button type="button" onClick={emailExists}>Send Reset Link</button>
                </div>
            </div>     
        </body>

    );

}

//ask the user for their email with which they signed up
//check with the backend:
//if that email exists in the database, there is a user with that database
//an email will be sent to that email with a link to re-creating their password
//once the user resets their password, it should go to the backend, find the
//corresponding email, and change the password in the database to be updated


export default ForgotPassPage