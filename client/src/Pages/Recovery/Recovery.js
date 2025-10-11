import React, { useState, useEffect } from 'react';
import './Recovery.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Dependencies
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
//Entry Checks
import { CheckUsername } from '../../Functions/EntryCheck'

const Recovery = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [redirect, setRedirect] = useState(false);

    const recoverAccount = async () => {
        if (username === null){
            return setStatusMessage("Username must be provided!");
        }
        else if(CheckUsername(username) === false){
            return setStatusMessage("Enter Valid Username Format");
        }
        else {
            setIsLoading(true);
        }

        const url = process.env.REACT_APP_Backend_URL + '/user/account_Recovery';

        await Axios.post(url, 
        {
        username: username,
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
                setIsLoading(false);
            }
            else {
                setStatusMessage('Verification Email Sent!');
                setIsLoading(false);
                setCount(3);           
                setRedirect(true);
            }
        });
    }

    useEffect(() => {
        count > 0 && setTimeout(() => setCount(count - 1), 1000);
        if (count === 0 && redirect === true){
            navigate('/login');
        }
    }, [count]);

    return (
        <>
            <Header/>
            <div className='recoveryPage_container'>
                <form className='recovery_form'>
                    <img src={companyLogo} alt ="Catching Souls Logo" />
                    <h1>Recover Account</h1>
                    <input name='username' placeholder='Username' required autoComplete="off" onChange={(e) => {setUsername(e.target.value)}} />
                    {isLoading && <button className='recoverButton' disabled>Loading...</button>}
                    {!isLoading && <button className='recoverButton' onClick={recoverAccount}>Recover Account</button>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
                </div>
            <Footer/>          
        </>
    );
}

export default Recovery;
