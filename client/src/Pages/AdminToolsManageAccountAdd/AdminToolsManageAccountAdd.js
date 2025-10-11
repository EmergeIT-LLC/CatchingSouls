import React, { useState, useEffect } from 'react';
import './AdminToolsManageAccountAdd.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Entry Checks
import { CheckEmail } from '../../Functions/EntryCheck'
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageAccountAdd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const validCookie = isCookieValid()
    const isAdmin = GetAdminRole();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [selectRole, setSelectRole] = useState("null");
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        GetLogoutStatus(AccountUsername);
        if (!userLoggedIn || !validCookie) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (GetLogoutStatus(AccountUsername)) {
            navigate('/Logout')
        }
        else if (!isAdmin) {
            navigate('/');
        }
    }, [userLoggedIn]);

    const submitForm = () => {
        if (firstName === null || lastName === null || email === null || confirmEmail === null || selectRole === "null"){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        else if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        }
        else if (CheckEmail(email) === false){
            return setStatusMessage("Email Is Not Acceptable");
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/register';
                
        Axios.post(url, {
            firstName : firstName,
            lastName : lastName,
            email : email,
            selectRole : selectRole
        })
        .then((response) => {
            if (response.data.registerStatus === "Successful") {
                setStatusMessage("User added successfully!");
                setIsLoading(false);
                setTimeout(() => {
                    navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts`);
                }, 2000);
            }
            else if (response.data.registerStatus === "Unsuccessful" && response.data.message === "User needs to check email to verify account"){
                setStatusMessage("User Is Already In Verification Stage!");
                setIsLoading(false);
                setTimeout(() => {
                    navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts`);
                }, 2000);

            }
            else if (response.data.registerStatus === "Unsuccessful"){
                if (response.data.message === "User needs to check email to verify account") {
                    setStatusMessage("User Is Already In Verification Stage!");
                    setIsLoading(false);
                    setTimeout(() => {
                        navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts`);
                    }, 2000);
                }
                else if (response.data.message === 'Email already registered!' || response.data.message === 'User already registered!') {
                    setStatusMessage(response.data.message);
                    setIsLoading(false);
                    setTimeout(() => {
                        navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts`);
                    }, 2000);
                }
                else {
                    setStatusMessage(response.data.message);
                    setIsLoading(false);
                }
            }
        })
        .catch((error) => {
            setStatusMessage(error.response.data.message);
            setIsLoading(false);
        });
    };

    return (
        <>
            <Header/>
            <div className='adminToolsManageAccountAddPage_container'>
                <form className='adminToolsManageAccountAdd_form'>
                    <h1>Register An Admin</h1>
                    <input name='firstName' placeholder='First Name' required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                    <input name='lastName' placeholder='Last Name' required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                    <input name='email' placeholder='Email Address' type='email' required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                    <input name='confirmEmail' placeholder='Confirm Email Address' type='email' required autoComplete="off" onChange={(e) => setConfirmEmail(e.target.value)} />
                    <select value={selectRole} required onChange={(e) => {setSelectRole(e.target.value)}}>
                        <option value="null">Select Role</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {isLoading && <button className='registerButton' disabled>Loading...</button>}
                    {!isLoading && <button className='registerButton' type='submit' onClick={submitForm}>Register</button>}
                    {!isLoading && <a href={`/${loggedInUser}/AdminTools/ManageAdminAccounts`}><button className='registerButton'>Return to Accounts</button></a>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}            
            </div>
            <Footer/>
        </>
    );
}

export default AdminToolsManageAccountAdd;
