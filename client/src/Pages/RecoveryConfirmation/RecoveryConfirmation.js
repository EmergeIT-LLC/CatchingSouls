import React, { useState, useEffect } from 'react';
import './RecoveryConfirmation.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import companyLogoGreyedOut from '../../Images/Logo_Transparent_GreyedOut.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { GetUserVerificationProps } from '../../Functions/VerificationCheck';
//Entry Checks
import { CheckPassword } from '../../Functions/EntryCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const RecoveryConfirmation = () => {
    const navigate = useNavigate();
    const {AccountUsername} = useParams();
    const [foundAccount, setFoundAccount] = useState(false);
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserVerificationProps(AccountUsername));
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        locateUnrecoveredAccount();
        setIsLoading(false);
    }, []);

    const locateUnrecoveredAccount = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/user/locateUnrecovered';

        await Axios.post(url, {AccountUsername : {AccountUsername}})
        .then((response) => {
            setFoundAccount(response.data.foundAccount);
            if (response.data.foundAccount){
                loggedInUserData.then(res => setFirstName(res.data.accountFirstName))
                loggedInUserData.then(res => setLastName(res.data.accountLastName));
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const submitForm = (e) => {
        e.preventDefault();
        if (password === null || confirmPassword === null){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        else if (password !== confirmPassword){
            return setStatusMessage("Password and confirm password does not match!");
        }
        else if (CheckPassword(password) === false){
            return setStatusMessage("Password Is Not Acceptable");
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/user/recoveryverification';
                
        Axios.post(url, {
            AccountUsername : {AccountUsername},
            password : password,
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
                setIsLoading(false);
            }
            else if (response.data.recoveryStatus === "Successful") {
                navigate('/Login');
            }
            else if (response.data.recoveryStatus === "Unsuccessful") {
                setStatusMessage("Recovery failed");
                setIsLoading(false);
            }
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
        });
    };

    return (
        <>
            <Header/>
            <div className='recoveryConfirmationPage_container'>
                <div className='recoveryConfirmation_form'>
                    {foundAccount ?
                        <>
                            <img src={companyLogo} alt ="Catching Souls Logo" />
                            <h1>Hello {firstName} {lastName},</h1>
                            <p>Please enter a password to recover your account.</p>
                            <input className='password' placeholder='Enter A Password' type='password' required autoComplete="off" onChange={(e) => {setPassword(e.target.value); }} />
                            <input className='confirmPassword' placeholder='Confirm Password' type='password' required autoComplete="off" onChange={(e) => {setConfirmPassword(e.target.value); }} />
                            {isLoading ? <button className='recoverButton' disabled>Loading...</button> : <button className='recoverButton' type='submit' onClick={submitForm}>Recover</button>}                        </>
                        :
                        <>
                            <img src={companyLogoGreyedOut} alt ="Catching Souls Logo Greyed Out" />
                            <h1 style={{color: 'crimson'}}>Account Not Found!</h1>
                            <p>Your account is already recovered <br/> or <br/> You have not made a recovery request.</p>
                        </>
                    }
                </div>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>
            <Footer/> 
        </>
    );
}

export default RecoveryConfirmation;
