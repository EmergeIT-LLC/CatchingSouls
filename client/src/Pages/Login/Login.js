import React, { useState, useEffect } from 'react';
import './Login.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Entry Checks
import checkUsername from '../../Functions/EntryCheck/checkUsername';
import checkPassword from '../../Functions/EntryCheck/checkPassword';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {    
    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = CheckLogin();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');


    useEffect(()=> {
        if (userLoggedIn) {
            navigate('/');
        }    
    }, [userLoggedIn]);

    const login = async () => {
        if (username === null || password === null){
            return setStatusMessage("Username and password must be provided!");
        }
        else if(checkUsername(username) === false || checkPassword(password) === false){
            return setStatusMessage("Account Does Not Exist or Password Is Incorrect!");
        }
        else {
            setIsLoading(true);
        }

        const url = process.env.REACT_APP_Backend_URL + '/user/login';

        await Axios.post(url, {
        username: username,
        password: password,
        }).then((response) => {
            setIsLoading(false);
            if (response.data.loggedIn) {
                sessionStorage.setItem('catchingSoulsLoggedin', true);
                sessionStorage.setItem('catchingSoulsUsername', response.data.username);

                if (response.data.isAdmin){
                    sessionStorage.setItem('catchingSoulsAdmin', true);
                }

                if (location.state == null) {
                    navigate('/');
                }
                else if (location.state.previousUrl !== location.pathname){
                    navigate(location.state);
                }
            } else {
                setStatusMessage(response.data.message);
            }
        });
    }

    return (
        <>
        <Header/>
            <div className='loginPage_container'>
                <form className='login_form'>
                    <img src={companyLogo} alt ="Catching Souls Logo" />
                    <h1>Catching Souls</h1>
                    <input name='username' placeholder='Username' required autoComplete="off" value={username} onChange={(e) => {setUsername(e.target.value)}} />
                    <input name='password' placeholder='Password' type='password' required autoComplete="off" value={password} onChange={(e) => {setPassword(e.target.value) }} />
                    {isLoading && <button className='loginButton' disabled>Loading...</button>}
                    {!isLoading && <button className='loginButton' type='submit' onClick={login}>Login</button>}
                    {isLoading ? <></> : <h2><a href='/Register'>Register?</a> or <a href='/ForgotPassword'>Reset Password?</a></h2>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>
            <Footer/>
        </>
    );
}

export default Login;