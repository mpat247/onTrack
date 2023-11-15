import './ResetPass.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = "http://localhost:5001";

function ResetPass() {
    const [statusString, setStatusString] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [email, setEmail] = useState('');

    async function resetPassword() {
        try {
            if (!newPassword || !confirmNewPass || !email) {
                setStatusString('Please enter all fields');
                return;
            }
            
            if (newPassword !== confirmNewPass) {
                setStatusString('The two passwords do not match.');
                return;
            }
            
            const newData = {
                password: newPassword,
                email: email
            };

            const response = await axios.put(`${api}/users/reset`, newData);
            if (response.status === 200) {
                setStatusString('Password has been successfully updated! Redirecting to login page...');
                setTimeout(() => {
                    window.location.href = '/onTrack';
                }, 5000);
            }
            else {
                setStatusString('Invalid request.');
            }
        }
        catch (error) {
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
                    <div className="input-group">
                        <label htmlFor="newpass">New Password</label>
                        <input type="password" id="newpass" name="newpass" onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmnewpass">Confirm New Password</label>
                        <input type="password" id="confirmnewpass" name="confirmnewpass" onChange={(e) => setConfirmNewPass(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="buttons">
                        <button type="button" onClick={resetPassword}>Reset Password</button>
                    </div>
                </div>
            </div>
        </body>
    );
}

export default ResetPass;
