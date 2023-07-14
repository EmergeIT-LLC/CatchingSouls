import React, { useState, useEffect } from 'react';
import './ProfileUpdate.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Entry Checks
import checkEmail from '../../Functions/EntryCheck/checkEmail';
import checkPassword from '../../Functions/EntryCheck/checkPassword'
import GetUserProps from '../../Functions/VerificationCheck/getUserProps';
import GetLogoutStatus from '../../Functions/VerificationCheck/getLogoutStatus';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
import CheckUser from '../../Functions/VerificationCheck/checkUser';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';


const ProfileUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckLogin();
    const loggedInUser = CheckUser(userLoggedIn);
    const logOutStatus = GetLogoutStatus(AccountUsername);
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps(userLoggedIn, loggedInUser));
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmNewPassword, setConfirmNewPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(()=> {
        setIsLoading(true);
        if (userLoggedIn && !logOutStatus) {
            loggedInUserData.then(res => setUsername(res.data.accountUsername));
            loggedInUserData.then(res => setFirstName(res.data.accountFirstName))
            loggedInUserData.then(res => setLastName(res.data.accountLastName));
            loggedInUserData.then(res => setEmail(res.data.accountEmail));
            loggedInUserData.then(res => setConfirmEmail(res.data.accountEmail));
            setIsLoading(false);
        }
        else if (logOutStatus) {
            setIsLoading(false);
            navigate('/Logout');
        }
        else if (AccountUsername !== loggedInUser) {
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
    }, [userLoggedIn]);

    const submitUpdateForm = () => {
        if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        }
        else if (checkEmail(email) == false){
            return setStatusMessage("Email Is Not Acceptable");
        } else if (password != null){
            if (newPassword == null || confirmNewPassword == null){
                return setStatusMessage("All Password fields must be filled in!");
            }
            else if (newPassword !== confirmNewPassword){
                return setStatusMessage("Password and confirm password does not match!");
            }
            else if (checkPassword(password) == false){
                return setStatusMessage("Current Password Is Incorrect");
            }    
            else if (checkPassword(newPassword) == false){
                return setStatusMessage("New Password Is Not Acceptable");
            }    
        } else if (password != null && newPassword == null || password != null && confirmNewPassword == null){
            return setStatusMessage("All Password fields must be filled in!");
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/User/account_Update';
               
        Axios.post(url, {
            username : loggedInUser,
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            newPassword : newPassword
        })
        .then((response) => {
            if (response.data.message){
                setIsLoading(false);
                setStatusMessage(response.data.message);
            }
            else if (response.data.updateStatus === "Successful") {
                navigate(`/Profile/${loggedInUser}`);
            }
            else if (response.data.updateStatus === "Unsuccessful") {
                setIsLoading(false);
                setStatusMessage("Update failed!");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            setStatusMessage(error.response.data.message);
        });
    };

    return (
        <>
            <Header/>
            <div className='profileUpdatePage_container'>
                <div className='profileUpdate_form'>
                {isLoading ?
                    <>
                        <h1>Loading...</h1>
                    </>
                :
                    <>
                        <h1>Update Profile</h1>
                        <input className='username' name='username' placeholder='Enter A Username' defaultValue={username} required autoComplete="off" disabled/>
                        <input className='firstName' placeholder='First Name' defaultValue={firstName} required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                        <input className='lastName' placeholder='Last Name' defaultValue={lastName} required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                        <input className='email' placeholder='Email Address' type='email' defaultValue={email} required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                        <input className='confirmEmail' placeholder='Confirm Email Address' type='email' defaultValue={confirmEmail} required autoComplete="off" onChange={(e) => setConfirmEmail(e.target.value)} />
                        <input className='currentpassword' placeholder='Enter Current Password' type='password' required autoComplete="off" onChange={(e) => {setPassword(e.target.value); }} />
                        <input className='password' placeholder='Enter New Password' type='password' required autoComplete="off" onChange={(e) => {setNewPassword(e.target.value); }} />
                        <input className='confirmPassword' placeholder='Confirm New Password' type='password' required autoComplete="off" onChange={(e) => {setConfirmNewPassword(e.target.value); }} />
                        {isLoading && <button className='profileUpdateButton' disabled>Loading...</button>}
                        {!isLoading && <button className='profileUpdateButton' type='submit' onClick={submitUpdateForm}>Update</button>}
                        {!isLoading && <a href={`/Profile/${loggedInUser}`}><button className='profileUpdateButton'>Cancel</button></a>}
                    </>
                }
                </div>
            <h2>{statusMessage}</h2>
            </div>
            <Footer/>
        </>
    );
}

export default ProfileUpdate;
