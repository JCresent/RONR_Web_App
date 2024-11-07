import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login-styles.css';
import loginIcon from '../../icons/login_icon.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home', { state: { userEmail: email } });
  };

  return (
    <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Blinker&display=swap" rel="stylesheet" />
        <title>Login Page</title>
        <form onSubmit={handleSubmit}>
            <div className="container">
                <div className="registration-title">
                    <h1 className="registration-item">Login</h1>
                    <img className="registration-item" id="registration-image" src={loginIcon} alt="login icon" />
                </div>
                    <br />
                    <br />
                    <br />
                    <label htmlFor="email" style={{ display: 'block', textAlign: 'left'}}><b>Email</b></label>
                    <input 
                      type="text" 
                      placeholder="Enter Email" 
                      name="email" 
                      id="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password" style={{ display: 'block', textAlign: 'left'}}><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="password" id="password" required />
                    <button type="submit" className="registerbtn">Login</button>
                    <br />
                    <br />
                    <div id="links">    
                        <Link to="/registration" >Don't have an account? Register</Link>
                        <Link to="/password-reset" > Did you forget your password?</Link>
                    </div>
            </div>
        </form>
    </div>
  );
};

export default LoginPage;
