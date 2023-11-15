import './ForgottenPass.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';
import axios from 'axios';
const api = "http://localhost:5001";

function ForgotPassPage() {
    const [statusString, setStatusString] = useState('');
    const [checkEmail, setCheckEmail] = useState('');

    async function emailExists() {
        try {
            if (!checkEmail) {
                setStatusString('Please enter a valid email.');
                return;
            } else {
                const response = await axios.get(`http://localhost:5001/users/reset?email=${encodeURIComponent(checkEmail)}`);
                if (response.status === 200) {
                    setStatusString('An email has been sent to your inbox. Please check your email for the reset password link.');
                } else if (response.status === 404) {
                    setStatusString('This email is not affiliated with any account. Please recheck the inputted email.');
                }
            }
        } catch (error) {
            console.error('Error', error);
            setStatusString('An error occurred. Please try again.');
        }
    };

    return (
        <body>
            <header>
                <div className="wave-header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#79addc" fillOpacity="1" d="M0,320L60,304C120,288,240,256,360,229.3C480,203,600,181,720,176C840,171,960,181,1080,181.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
                    </svg>
                </div>
                <div id="logo-container"> 
                    <img src={onTrackLogo} id="logo" alt="Logo" />
                    <div id="title">onTrack</div>
                </div>
            </header>
            <div id="input-container">
                <div id="form-container">
                    <h3 id="resolve">{statusString}</h3>
                    <h3>Please enter your email for your account</h3>
                    <div className="input-group">
                        <input type="email" id="emailtext" name="emailtext" onChange={(e) => setCheckEmail(e.target.value)} />
                    </div>
                    <div className="buttons">
                        <button type="button" onClick={emailExists}>Send Reset Link</button>
                    </div>
                </div>
            </div>     
        </body>
    );
}

export default ForgotPassPage;
