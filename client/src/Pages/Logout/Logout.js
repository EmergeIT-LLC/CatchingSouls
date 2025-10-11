import React, { useState } from 'react';
import './Logout.css'
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import {CheckUser, CheckUserLogin, CheckGuestLogin} from '../../Functions/VerificationCheck';
import { CookieCheck } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';

const Logout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const loggedInUser = CheckUser();

    const logout = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/user/logout';

        await Axios.post(url, {username: loggedInUser})
        .then((response) => {
            if (response.data.cookieSettings) {
                CookieCheck(response.data.cookieSettings.name, response.data.cookieSettings.value, response.data.cookieSettings.options);
            }
            setStatusMessage(response.data.message);
        });
    }

    if (CheckUserLogin()) {
        setIsLoading(true);
        logout();
        localStorage.removeItem('catchingSoulsUserLoggedin');
        localStorage.removeItem('catchingSoulsUsername');
        localStorage.removeItem('catchingSoulsAdmin');
        setIsLoading(false);
    }
    else if (CheckGuestLogin()) {
        setIsLoading(true);
        sessionStorage.removeItem('catchingSoulsGuestLoggedin');
        sessionStorage.removeItem('catchingSoulsGuestUsername');
        sessionStorage.removeItem('catchingSoulsGuestPoints');
        setIsLoading(false);
    }

    return (
        <>
            <Header/>
            <div className='logoutPage_container'>
                <div className='logout_form'>
                {isLoading ?
                    <>
                        <h1>Loading...</h1>
                    </>
                    :
                    <>
                        <img src={companyLogo} alt ="Catching Souls Logo" />
                        <h1>{statusMessage}</h1>
                        <p>Select <strong>login</strong> to sign back in!</p>
                        <a href='/login'><button className='logoutButton'>Login</button></a>
                    </>
                }
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Logout;