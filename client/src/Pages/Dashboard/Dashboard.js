import React, { useState, useEffect } from 'react';
import './Dashboard.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckGuestLogin, GetUserProps } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
import TimeOfDay from '../../Functions/timeOfDay';
//Repositories
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const timeOfDay = TimeOfDay();
    const userLoggedIn = CheckUserLogin();
    const guestLoggedIn = CheckGuestLogin();
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps());
    const validCookie = isCookieValid()
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        if (!userLoggedIn && !guestLoggedIn && !validCookie) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else {
            setIsLoading(true);
            if (guestLoggedIn) {
                setFirstName("Guest")
            }
            else {
                loggedInUserData.then(res => setFirstName(res.data.user.accountFirstName));
                loggedInUserData.then(res => setLastName(res.data.user.accountLastName));
            }
        }
        setIsLoading(false);
    }, [userLoggedIn, guestLoggedIn]);

    return (
        <>
            <Header/>
                <div className='dashboardPage_container'>
                    <div className='dashboard_form'>
                    {isLoading ?
                        <>
                            <h1>Loading...</h1>
                        </>
                        :
                        <>
                            <img src={companyLogo} alt ="Catching Souls Logo" />
                            <h1>{timeOfDay} {firstName},</h1>
                            <p>Do you know your bible enough to spread the lord's message and save souls?</p>
                            <p>How about seeing the number of souls you can save with some questions?</p>
                            <a href='/LevelChoice'><button className='dashboardButton'>How Many Souls Can you Save?</button></a>
                        </>
                    }
                </div>
            </div> 
            <Footer/>      
        </>
    );
}

export default Dashboard;