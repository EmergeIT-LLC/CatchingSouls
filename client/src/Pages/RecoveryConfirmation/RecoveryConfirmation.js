import React, { useState, useEffect } from 'react';
import './RecoveryConfirmation.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import companyLogoGreyedOut from '../../Images/Logo_Transparent_GreyedOut.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import GetUserProps from '../../Functions/VerificationCheck/getUserProps';
//Entry Checks
import checkPassword from '../../Functions/EntryCheck/checkPassword'
//Repositories
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const RecoveryConfirmation = () => {
    const navigate = useNavigate();
    const {AccountUsername} = useParams();
    const [foundAccount, setFoundAccount] = useState(false);
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps(true, AccountUsername));
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
            setFoundAccount(response.data.foundAdminAccount);
            if (response.data.foundAdminAccount){
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
        if (password == null || confirmPassword == null){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        else if (password !== confirmPassword){
            return setStatusMessage("Password and confirm password does not match!");
        }
        else if (checkPassword(password) == false){
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
                setIsLoading(false);
                setStatusMessage(response.data.message);
            }
            else if (response.data.recoveryStatus === "Successful") {
                navigate('/Login');
            }
            else if (response.data.recoveryStatus === "Unsuccessful") {
                setIsLoading(false);
                setStatusMessage("Recovery failed");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error);
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
                            {isLoading && <button className='recoverButton' disabled>Loading...</button>}
                            {!isLoading && <button className='recoverButton' type='submit' onClick={submitForm}>Recover</button>}
                        </>
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
