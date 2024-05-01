import React, { useState } from 'react';
import './Logout.css'
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import {CheckUserLogin, CheckGuestLogin} from '../../Functions/VerificationCheck';
//Repositories
import Axios from 'axios';

const Logout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const logout = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/user/logout';
        setIsLoading(true);

        await Axios.post(url)
        .then((response) => {
            setStatusMessage(response.data.message);
            setIsLoading(false);
        });
    }

    if (CheckUserLogin()) {
        logout();
        localStorage.removeItem('catchingSoulsUserLoggedin');
        localStorage.removeItem('catchingSoulsUsername');
        localStorage.removeItem('catchingSoulsAdmin');
    }
    else if (CheckGuestLogin()) {
        sessionStorage.removeItem('catchingSoulsGuestLoggedin');
        sessionStorage.removeItem('catchingSoulsGuestUsername');
        sessionStorage.removeItem('catchingSoulsGuestPoints');
    }

    return (
        <>
            <Header/>
            <div className='logoutPage_container'>
                <div className='logout_form'>
                    <img src={companyLogo} alt ="Catching Souls Logo" />
                    <h1>{statusMessage}</h1>
                    <p>Select <strong>login</strong> to sign back in!</p>
                    <a href='/login'><button className='logoutButton'>Login</button></a>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Logout;