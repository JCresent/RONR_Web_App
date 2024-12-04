import React from 'react';
import { Link } from 'react-router-dom';
import './login-styles.css';
import registerIcon from '../../icons/registration_icon.svg';

const RegistrationPage = () => {

    return (
        <div>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
            <link href="https://fonts.googleapis.com/css2?family=Blinker&display=swap" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Registration page</title>
            <link rel="stylesheet" href="login-styles.css" />
            <form action="/action_page.php">
                <div className="container">
                <div className="registration-title">
                    <h1 className="registration-item">Register</h1>
                    <img className="registration-item" id="registration-image" src={registerIcon} alt="register button" />
                </div>
                <br />
                <br />
                <br />
                <form action="../../../../newuser/post" method="post" className="reg_form">
                    <label htmlFor="email" style={{ display: 'block', textAlign: 'left'}}><b>Email</b></label>
                    <input type="text" placeholder="Enter Email" name="email" id="email" required />
                    <label htmlFor="psw" style={{ display: 'block', textAlign: 'left'}}><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" id="psw" required />
                    <label htmlFor="psw-repeat" style={{ display: 'block', textAlign: 'left'}}><b>Re-enter Password</b></label>
                    <input type="password" placeholder="Repeat Password" name="psw-repeat" id="psw-repeat" required />
                    <button type="submit" className="registerbtn">Register</button>
                </form>
                <br />
                <br />
                    <div id="links">
                        <Link to="/" >Already have an account?</Link>
                    </div>
                </div>
            </form>
        </div>


    );

};

export default RegistrationPage;