import React, { useState, useEffect } from 'react';
import './Profile.css'
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
import CheckUser from '../../Functions/VerificationCheck/checkUser';
import GetUserProps from '../../Functions/VerificationCheck/getUserProps';
import GetLogoutStatus from '../../Functions/VerificationCheck/getLogoutStatus';
import GetAdminRole from '../../Functions/VerificationCheck/getAdminRole';
//Repositories
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckLogin();
    const loggedInUser = CheckUser(userLoggedIn);
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps(userLoggedIn, loggedInUser));
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [showButtons, setShowButtons] = useState(true);
    const isAdmin = GetAdminRole();

    useEffect(() => {
        if (userLoggedIn === false) {
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
            loggedInUserData.then(res => setFirstName(res.data.accountFirstName))
            loggedInUserData.then(res => setLastName(res.data.accountLastName));
            loggedInUserData.then(res => setEmail(res.data.accountEmail));
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