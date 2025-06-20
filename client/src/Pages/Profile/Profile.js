import React, { useState, useEffect } from 'react';
import './Profile.css'
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetUserProps, GetAdminRole } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps());
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [savedSouls, setSavedSouls] = useState('');
    const [selectDenomination, setSelectDenomination] = useState(null);
    const [churchName, setChurchName] = useState(null);
    const [churchLocation, setChurchLocation] = useState(null);
    const [churchState, setChurchState] = useState(null);
    const [showButtons, setShowButtons] = useState(true);
    const isAdmin = GetAdminRole();
    const validCookie = isCookieValid()

    useEffect(() => {
        if (!userLoggedIn || !validCookie) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (AccountUsername !== loggedInUser) {
            navigate('/');
        }
        else {
            loggedInUserData.then(res => setFirstName(res.data.user.accountFirstName))
            loggedInUserData.then(res => setLastName(res.data.user.accountLastName));
            loggedInUserData.then(res => setEmail(res.data.user.accountEmail));
            loggedInUserData.then(res => setSavedSouls(res.data.user.savedSouls));
            loggedInUserData.then(res => setSelectDenomination(res.data.user.denomination));
            loggedInUserData.then(res => setChurchName(res.data.user.churchName));
            loggedInUserData.then(res => setChurchLocation(res.data.user.churchLocation));
            loggedInUserData.then(res => setChurchState(res.data.user.churchState));
            if (isAdmin) {
                setShowButtons(false);
            }
        }
    }, [userLoggedIn]);

    return (
        <>
            <Header/>
            <div className='profilePage_container'>
                <div className='profile_form'>
                {isLoading ?
                    <>
                        <h1>Loading...</h1>
                    </>
                    :
                    <>
                        <h1>{firstName} {lastName}</h1>
                        <div className='profileInfo_form'>
                            <p><b>Username:</b> {loggedInUser}</p>
                            <p><b>Email:</b> {email}</p>
                            <p><b>Saved Souls:</b> {savedSouls}</p>
                            {churchName ?
                                <> 
                                    <p><b>Church:</b> {churchName} {selectDenomination} Church in {churchLocation}, {churchState}</p>
                                </>
                                :
                                <>
                                    <p><b>Church:</b></p>
                                </>
                            }
                        </div>
                        <a href={`/Profile/${loggedInUser}/Update`}><button className='profileButton'>Update Profile</button></a>
                        {showButtons ? <a href={`/Profile/${loggedInUser}/Delete`}><button className='profileButton'>Delete Profile</button></a> : <></>}
                    </>
                }    
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Profile;