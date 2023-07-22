import React, { useState, useEffect } from 'react';
import './Dashboard.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
import CheckUser from '../../Functions/VerificationCheck/checkUser';
import GetUserProps from '../../Functions/VerificationCheck/getUserProps';
import TimeOfDay from '../../Functions/Extra/timeOfDay';
//Repositories
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const timeOfDay = TimeOfDay();
    const userLoggedIn = CheckLogin();
    const guestLoggedIn = sessionStorage.getItem('catchingSoulsGuestLoggedin');
    const loggedInUser = CheckUser(userLoggedIn);
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps(userLoggedIn, loggedInUser));
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    useEffect(() => {
        if (!userLoggedIn && !guestLoggedIn) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else {
            if (guestLoggedIn) {
                setFirstName("Guest")
            }
            else {
                loggedInUserData.then(res => setFirstName(res.data.accountFirstName));
                loggedInUserData.then(res => setLastName(res.data.accountLastName));
            }
        }
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