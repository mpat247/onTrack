import React, { useState } from 'react';

const UserDetailsForm = ({ onSubmit }) => {
  const [changeType, setChangeType] = useState(''); // State to track whether user wants to change username or password
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleTypeChange = (e) => {
    setChangeType(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      changeType,
      newData: changeType === 'username' ? newUsername : newPassword,
    });
    setNewUsername('');
    setNewPassword('');
    setChangeType('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="changeType">Select what you want to change:</label>
        <select id="changeType" value={changeType} onChange={handleTypeChange}>
          <option value="">Select</option>
          <option value="username">Username</option>
          <option value="password">Password</option>
        </select>
      </div>
      {changeType === 'username' && (
        <div>
          <label htmlFor="newUsername">New Username:</label>
          <input
            type="text"
            id="newUsername"
            value={newUsername}
            onChange={handleUsernameChange}
          />
        </div>
      )}
      {changeType === 'password' && (
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
          />
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserDetailsForm;
