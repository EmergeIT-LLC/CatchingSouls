import React, { useState, useEffect } from 'react';
import './LevelChoice.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckGuestLogin } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import { useNavigate, useLocation } from 'react-router-dom';

const LevelChoice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = CheckUserLogin();
    const guestLoggedIn = CheckGuestLogin();
    const validCookie = isCookieValid()

    useEffect(()=> {
        if (userLoggedIn && validCookie || guestLoggedIn){
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
    }, [userLoggedIn]);

    return (
        <>
            <Header/>
            <div className='levelChoicePage_container'>
                <div className='levelChoice_form'>
                    <h1>Trivia Levels</h1>
                    <p>Beginner: +1 Point</p>
                    <p>Intermediate: +2 Point</p>
                    <p>Advance: +3 Point</p>
                    <a href='/LevelChoice/Beginner'><button className='levelChoiceButton'>Beginner</button></a>
                    <a href='/LevelChoice/Intermediate'><button className='levelChoiceButton'>Intermediate</button></a>
                    <a href='/LevelChoice/Advance'><button className='levelChoiceButton'>Advance</button></a>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default LevelChoice;