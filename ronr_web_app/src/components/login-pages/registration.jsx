import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login-styles.css';
import registerIcon from '../../icons/registration_icon.svg';

const RegistrationPage = () => {
    const navigate = useNavigate();

    // Define state variables for form input and errors 
    const [formInput, setFormInput] = useState({
        email: "",
        psw: "",
        confirmPassword: "", 
    });

    const [formError, setFormError] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleUserInput = (name, value) => {
        setFormInput({
            ...formInput,
            [name]: value,
        });
    };

    const validateFormInput = async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        // Track input errors
        let inputError = {
            email: "",
            password: "",
            confirmPassword: "",
        }; 

        // Regexes 
        const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
        const validPassword = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$'); //One upper case, one lower case, one digit, one special character, 8 length

        // Check if passwords match
        if (formInput.confirmPassword !== formInput.psw) {
            console.log("Don't match!");
            setFormError({
                ...inputError,
                confirmPassword: "Passwords should match",
            });
            return false;
        }

        // Check to make sure email is valid 
        if (!validEmail.test(formInput.email)) {
            console.log("Invalid Email Format");
            setFormError({
                ...inputError,
                email: "Invalid Email Format",
            });
            return false;
        }

        // Check to make sure password is valid 
        if (!validPassword.test(formInput.psw)) {
            console.log("Password is too weak");
            setFormError({
                ...inputError,
                password: "Password must contain: 1 Upper Case, 1 Lower Case, 1 Number, 1 Special Char, and 8 Characters Long",
            });
            return false;
        }

        // Clear previous errors 
        setFormError(inputError); 

        try {
            const response = await fetch('/newuser/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formInput.email,
                    psw: formInput.psw
                }),
            });

            if (response.ok) {
                // Successfully created user, navigate to login page
                navigate('/');
                return true;
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to create account');
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create account');
            return false;
        }
    }

    return (
        <div>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
            <link href="https://fonts.googleapis.com/css2?family=Blinker&display=swap" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Registration page</title>
            <link rel="stylesheet" href="login-styles.css" />
                <div className="container">
                <div className="registration-title">
                    <h1 className="registration-item">Register</h1>
                    <img className="registration-item" id="registration-image" src={registerIcon} alt="register button" />
                </div>
                <br />
                <br />
                <br />
                <form onSubmit={validateFormInput} className="reg_form">
                    <label htmlFor="email" style={{ display: 'block', textAlign: 'left'}}><b>Email</b></label>
                    <input value={formInput.email} onChange={({ target }) => {handleUserInput(target.name, target.value)} } type="text" placeholder="Enter Email" name="email" id="email" required />
                    <p className="error-message">{formError.email}</p>

                    <label htmlFor="psw" style={{ display: 'block', textAlign: 'left'}}><b>Password</b></label>
                    <input value={formInput.psw} onChange={({ target }) => { handleUserInput(target.name, target.value)} } type="password" placeholder="Enter Password" name="psw" id="psw" required />
                    <p className="error-message">{formError.password}</p>

                    <label htmlFor="psw-repeat" style={{ display: 'block', textAlign: 'left'}}><b>Re-enter Password</b></label>
                    <input value={formInput.confirmPassword} onChange={({ target }) => { handleUserInput(target.name, target.value)} }  type="password" placeholder="Repeat Password" name="confirmPassword" id="psw-repeat" required />
                    <p className="error-message">{formError.confirmPassword}</p>

                    <button type="submit" className="registerbtn">Register</button>
                </form>
                <br />
                <br />
                    <div id="links">
                        <Link to="/" >Already have an account?</Link>
                    </div>
                </div>
        </div>


    );

};

export default RegistrationPage;