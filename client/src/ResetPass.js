import './ResetPassword.css';
import React, { useState } from 'react';
import onTrackLogo from './onTrackLogo.png';
import MainPage from './MainPage';
import { Link } from 'react-router-dom';
const api = "http://localhost:5001"


function ResetPass() {

    const [statusString, setStatusString] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [ConfirmnewPass, setConfirmnewPass] = useState('');
    const [email, setEmail] = useState('');

    async function resetPassword() {
        try {
            //check that email field is not empty
            if (!newPassword || !ConfirmnewPass || !email) {
                setStatusString('Please enter all fields');
                return;
            }
            
            if (newPassword !== ConfirmnewPass) {
                setStatusString('The two passwords do not match.')
            }
            else {
                console.log(checkEmail);
                
                const newData = {
                    password: newPassword,
                    email: email
                }

                const response = await axios.put(`http://localhost:5001/users/reset`, newData);
                console.log(response);
                if (response.status === 200) {
                    setStatusString('Password has been successfully updated! Redirecting to login page...')

                    setTimeout(() => {
                        window.location.href('/onTrack');
                    }, 5000);
                }
                else if (response.status === 500) {
                    setStatusString('Invalid request.')
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
                    <label for="newpass"> New Password</label>
                    <input type="text" id="newpass" name="newpass" onChange={(e) => setnewPassword(e.target.value)}></input>
                </div>
                <div class='input-group'>
                    <label for="newpass">Confirm New Password</label>
                    <input type="text" id="confirmnewpass" name="confirmnewpass" onChange={(e) => setConfirmnewPass(e.target.value)}></input>
                </div>
                <div class='input-group'>
                    <label for="newpass">Email</label>
                    <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div class='buttons'>
                    <button type="button" onClick={resetPassword}>Reset Password</button>
                </div>
            </div>     
        </body>

    );

}

export default ResetPass