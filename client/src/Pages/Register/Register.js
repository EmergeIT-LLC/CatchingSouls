import React, { useState } from 'react';
import './Register.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Entry Checks
import checkUsername from '../../Functions/EntryCheck/checkUsername';
import checkEmail from '../../Functions/EntryCheck/checkEmail';
import checkPassword from '../../Functions/EntryCheck/checkPassword'
//Repositories
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const submitForm = () => {
        if (firstName == null || lastName == null || username == null || email == null || confirmEmail == null || password == null || confirmPassword == null){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        else if (checkUsername(username) === false){
            return setStatusMessage("Username Is Not Acceptable");
        }
        else if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        }
        else if (checkEmail(email) === false){
            return setStatusMessage("Email Is Not Acceptable");
        }
        else if (password !== confirmPassword){
            return setStatusMessage("Password and confirm password does not match!");
        }
        else if (checkPassword(password) === false){
            return setStatusMessage(<>Password Is Not Acceptable!<br/><br/>Password must contain the following:<br/>Uppercase Letter<br/>Lowercase Letter<br/>Numbers<br/>Special Characters</>);
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/User/register';
                
        Axios.post(url, {
            firstName : firstName,
            lastName : lastName,
            username : username,
            email : email,
            password : password
        })
        .then((response) => {
            if (response.data.message){
                setIsLoading(false);
                setStatusMessage(response.data.message);
            }
            else if (response.data.registerStatus === "Successful") {
                navigate('/Login');
            }
            else if (response.data.registerStatus === "Unsuccessful") {
                setIsLoading(false);
                setStatusMessage("An error occurred");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            setStatusMessage(error.response.data.message);
        });
    };
      
    return (
        <>
            <Header/>
            <div className='registerPage_container'>
                <div className='register_form'>
                    <h1>Register</h1>
                    <input className='username' name='username' placeholder='Enter A Username' required autoComplete="off" onChange={(e) => {setUsername(e.target.value); }} />
                    <input className='firstName' placeholder='First Name' required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                    <input className='lastName' placeholder='Last Name' required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                    <input className='email' placeholder='Email Address' type='email' required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                    <input className='confirmEmail' placeholder='Confirm Email Address' type='email' required autoComplete="off" onChange={(e) => setConfirmEmail(e.target.value)} />
                    <input className='password' placeholder='Enter A Password' type='password' required autoComplete="off" onChange={(e) => {setPassword(e.target.value); }} />
                    <input className='confirmPassword' placeholder='Confirm Password' type='password' required autoComplete="off" onChange={(e) => {setConfirmPassword(e.target.value); }} />
                    {isLoading && <button className='registerButton' disabled>Loading...</button>}
                    {!isLoading && <button className='registerButton' type='submit' onClick={submitForm}>Register</button>}
                </div>
            {isLoading ? <></> : <h2>{statusMessage}</h2>}
            </div>  
            <Footer/>
        </>
    );
}

export default Register;