import React, { useState, useEffect } from 'react';
import './Login.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Entry Checks
import { CheckUsername, CheckPassword } from '../../Functions/EntryCheck';
//Functions
import {CheckUserLogin} from '../../Functions/VerificationCheck';
import { CookieCheck } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {    
    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = CheckUserLogin();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);


    useEffect(() => {
        if (userLoggedIn === true) {
          navigate('/');
        }
    }, [userLoggedIn, navigate]);

    const login = async (e) => {
        e.preventDefault();
        if (username === null || password === null){
            return setStatusMessage("Username and password must be provided!");
        }
        else if(CheckUsername(username) === false || CheckPassword(password) === false){
            return setStatusMessage("Account Does Not Exist or Password Is Incorrect!");
        }
        else {
            setIsLoading(true);
        }

        const url = process.env.REACT_APP_Backend_URL + '/user/login';

        await Axios.post(url, {
        username: username,
        password: password,
        })
        .then((response) => {
            setIsLoading(false);
            if (response.data.loggedIn) {
                localStorage.setItem('catchingSoulsUserLoggedin', true);
                localStorage.setItem('catchingSoulsUsername', response.data.username);

                if (response.data.isAdmin){
                    localStorage.setItem('catchingSoulsAdmin', true);
                }
                if (response.data.cookieSetting) {
                    CookieCheck(response.data.cookieSetting.name, response.data.cookieSetting.value, response.data.cookieSetting.options);
                }        
                if (location.state === null) {
                    navigate('/');
                }
                else if (location.state.previousUrl !== location.pathname){
                    navigate(location.state);
                }
            } else {
                setStatusMessage(response.data.message);
            }
        })
        .catch((error) => {
            console.error("Axios network error:", error);
            setIsLoading(false);
        });
    }

    const guestLogin = () => {
        sessionStorage.setItem('catchingSoulsGuestLoggedin', true);
        sessionStorage.setItem('catchingSoulsGuestUsername', "Guest");
        sessionStorage.setItem('catchingSoulsGuestPoints', 0);
        navigate('/');
    }

    return (
        <>
        <Header/>
            <div className='loginPage_container'>
                <form className='login_form'>
                    <img src={companyLogo} alt ="Catching Souls Logo" />
                    <h1>Catching Souls</h1>
                    <input name='username' placeholder='Username' autoComplete="off" value={username} onChange={(e) => {setUsername(e.target.value)}} />
                    <input name='password' placeholder='Password' type='password' autoComplete="off" value={password} onChange={(e) => {setPassword(e.target.value) }} />
                    {isLoading && <button className='loginButton' disabled>Loading...</button>}
                    {!isLoading && <button className='loginButton' type='submit' onClick={login}>Login</button>}
                    {isLoading ? <></> : <button className='loginButton' onClick={guestLogin}>Login As Guest</button>}
                    {isLoading ? <></> : <h2><a href='/Register'>Register?</a> or <a href='/ForgotPassword'>Reset Password?</a></h2>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>
            <Footer/>
        </>
    );
}

export default Login;