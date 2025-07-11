import React, { useState, useEffect } from 'react';
import './ProfileDelete.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetAdminRole, GetUserProps, GetLogoutStatus } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const ProfileDelete = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const logOutStatus = GetLogoutStatus(AccountUsername);
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps());
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState();
    const [statusMessage, setStatusMessage] = useState(null);
    const validCookie = isCookieValid()
    const isAdmin = GetAdminRole();


    useEffect(()=> {
        setIsLoading(true);
        if (!logOutStatus & validCookie){
            loggedInUserData.then(res => setUsername(res.data.user.accountUsername));
            loggedInUserData.then(res => setFirstName(res.data.user.accountFirstName));

            if (isAdmin){
                navigate(`/Profile/${username}`);
            }
            setIsLoading(false);
        }
        else if (AccountUsername.toLowerCase() !== loggedInUser.toLowerCase()) {
            navigate('/');
        }
        else {
            setIsLoading(false);
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
    }, [logOutStatus]);

    const deleteUserProps = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/user/account_Delete';
                
        Axios.post(url, {
            username : username,
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
                setIsLoading(false);
            }
            else if (response.data.deleteStatus === "Successful") {
                navigate('/Logout');
            }
            else if (response.data.deleteStatus === "Unsuccessful") {
                setStatusMessage("Deletion failed");
                setIsLoading(false);
            }
        })
        .catch((error) => {
            console.log(error.response.data.message);
            setIsLoading(false);
        });
    };

    return (
        <>
            <Header/>
            {isLoading ?
                <div className='page_container'>
                    <div className='profileDelete_form'>
                        <h1>Loading...</h1>
                    </div>
                <h2></h2>
                </div>       
            :            
                <div className='profileDeletePage_container'>
                    <div className='profileDelete_form'>
                        <h1>Delete Profile</h1>
                        <p><b>{firstName}</b>, are you sure you want to delete your account?</p>
                        <button className='profileDeleteButton' type='submit' onClick={deleteUserProps}>Yes</button>
                        <a href={`/Profile/${loggedInUser}`}><button className='profileDeleteCancelButton'>No</button></a>
                    </div>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
                </div>
            }
            <Footer/>
        </>
    );
}

export default ProfileDelete;
