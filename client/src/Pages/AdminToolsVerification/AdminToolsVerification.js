import React, { useState, useEffect } from 'react';
import './AdminToolsVerification.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import companyLogoGreyedOut from '../../Images/Logo_Transparent_GreyedOut.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { GetUserVerificationProps } from '../../Functions/VerificationCheck';
//Entry Checks
import { CheckPassword } from '../../Functions/EntryCheck'
//Repositories
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AdminToolsVerification = () => {
    const navigate = useNavigate();
    const {AccountUsername} = useParams();
    const [foundAdminAccount, setFoundAdminAccount] = useState(false);
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserVerificationProps(AccountUsername));
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        locateUnverifiedAccount();
        setIsLoading(false);
    }, []);

    const locateUnverifiedAccount = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/UnverifiedInfo';

        await Axios.post(url, {AccountUsername : {AccountUsername}})
        .then((response) => {
            setFoundAdminAccount(response.data.foundAdminAccount);
            if (response.data.foundAdminAccount){
                loggedInUserData.then(res => setFirstName(res.data.accountFirstName))
                loggedInUserData.then(res => setLastName(res.data.accountLastName));
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const submitForm = () => {
        if (password == null || confirmPassword == null){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        else if (password !== confirmPassword){
            return setStatusMessage("Password and confirm password does not match!");
        }
        else if (CheckPassword(password) == false){
            return setStatusMessage("Password Is Not Acceptable");
        }

        setIsLoading(true);
        const url = 'http://localhost:3001/admin/adminTool/Verification';
                
        Axios.post(url, {
            AccountUsername : {AccountUsername},
            password : password,
        })
        .then((response) => {
            if (response.data.message){
                setIsLoading(false);
                setStatusMessage(response.data.message);
            }
            else if (response.data.VerificationStatus === "Successful") {
                navigate('/Login');
            }
            else if (response.data.VerificationStatus === "Unsuccessful") {
                setIsLoading(false);
                setStatusMessage("Verification failed!");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console(error);
        });
    };

    return (
        <>
            <Header/>
            <div className='adminToolsVerificationPage_container'>
                <div className='adminToolsVerification_form'>
                    {foundAdminAccount ?
                        <>
                            <img src={companyLogo} alt ="Catching Souls Logo" />
                            <h1>Hello {firstName} {lastName},</h1>
                            <p>Please enter a password to verify your account.</p>
                            <input className='password' placeholder='Enter A Password' type='password' required autoComplete="off" onChange={(e) => {setPassword(e.target.value); }} />
                            <input className='confirmPassword' placeholder='Confirm Password' type='password' required autoComplete="off" onChange={(e) => {setConfirmPassword(e.target.value); }} />
                            {isLoading && <button className='registerButton' disabled>Loading...</button>}
                            {!isLoading && <button className='registerButton' type='submit' onClick={submitForm}>Register</button>}
                        </>
                        :
                        <>
                            <img src={companyLogoGreyedOut} alt ="Catching Souls Logo Greyed Out" />
                            <h1 style={{color: 'crimson'}}>Not Verified!</h1>
                            <p>Your account is already verified <br/> or <br/> You are not a registered admin.</p>
                            <p>Contact an admin by emailing <a href="mailto:catchingsoulstrivia@outlook.com">CatchingSoulsTrivia@Outlook.com</a></p>
                        </>
                    }
                </div>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}            
            </div>
            <Footer/> 
        </>
    );
}

export default AdminToolsVerification;
