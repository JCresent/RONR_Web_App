import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login-styles.css';
import loginIcon from '../../icons/login_icon.svg';
import { useUser } from '../../context/UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('/findUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          id: data.userId,
          email: data.username
        });
        navigate('/home');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    }
  };

  return (
    <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Blinker&display=swap" rel="stylesheet" />
        <title>Login Page</title>
        <form onSubmit={handleSubmit} className="signin_form">
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
                    <input 
                      type="password" 
                      placeholder="Enter Password" 
                      name="password" 
                      onChange={(e) => setPassword(e.target.value)}
                      id="password" required />
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
