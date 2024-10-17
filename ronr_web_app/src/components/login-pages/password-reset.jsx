import React from 'react';
import { Link } from 'react-router-dom';
import './login-styles.css';
import lockIcon from '../../icons/password_lock_icon.svg';

const PasswordResetPage = () => {

    return (
        <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Blinker&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="login-styles.css" />
        <title>Password Reset</title>
        <form action="/action_reset_password.php">
            <div className="container">
            <div className="registration-title">
                <h1 className="registration-item">Password Reset</h1>
                <img className="registration-item" id="reset-image" src={lockIcon} alt="lock icon" />
            </div>
            <br />
            <br />
            <br />
            <label htmlFor="email"><b>Send Email</b></label>
            <input type="email" placeholder="Enter Email" id="email" name="email" required />
            <button type="submit" className="registerbtn">
                Send Password Reset Email
            </button>
            <br />
            <br />
            <div id="links">
                <Link to="/" >Return to login?</Link>
            </div>
            </div>
        </form>
        </div>
    );
};

export default PasswordResetPage;