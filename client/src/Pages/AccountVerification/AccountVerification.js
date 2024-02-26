import React, { useState, useEffect } from 'react';
import './AccountVerification.css';
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import companyLogoGreyedOut from '../../Images/Logo_Transparent_GreyedOut.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Repositories
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const AccountVerification = () => {
    const {AccountUsername} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [foundAccount, setFoundAccount] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        locateUnverifiedAccount();
        setIsLoading(false);
    }, []);

    const locateUnverifiedAccount = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/user/verificationInfo';

        await Axios.post(url, {AccountUsername : {AccountUsername}})
        .then((response) => {
            if (response.data.foundAccount == true){
                setFoundAccount(true);
                verifyUserAccount();
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const verifyUserAccount = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/user/verifyUser';

        await Axios.post(url, {AccountUsername : {AccountUsername}})
        .then((response) => {
            if (response.data.Verified == true) {
                setVerified(true);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <>
            <Header/>
            <div className='accountverificationpage_container'>
                <form className='accountverification_form'>
                    {isLoading ? 
                        <>
                            <h1>Loading...</h1>
                        </> 
                        :
                        <>
                            {foundAccount ?
                                <>
                                    {verified ?
                                        <>
                                            <img src={companyLogo} alt ="Catching Souls Logo" />
                                            <h1 style={{color: 'green'}}>Verified!</h1>
                                            <p>Your account has been verified.</p>
                                            <p><strong>Select login</strong> to sign in!</p>
                                            <Link to='/Login'><button className='verifiedButton'>Login</button></Link>
                                        </>
                                    :
                                        <>
                                            <h1 style={{color: 'crimson'}}>Not Verified!</h1>
                                            <p>Verification failed <br/> Please try again later.</p>
                                        </>
                                    }
                                </>
                                :
                                <>
                                    <img src={companyLogoGreyedOut} alt ="Catching Souls Logo Greyed Out" />
                                    <h1 style={{color: 'crimson'}}>Not Verified!</h1>
                                    <p>Your account is already verified <br/> or you never registered.</p>
                                    <p>Select <strong>login</strong> to sign back in! <br/> or  <br/> Select <strong>Register</strong> to sign up! </p>
                                    <Link to='/Login'><button className='verifiedButton'>Login</button></Link>
                                    <Link to='/Register'><button className='verifiedButton'>Register</button></Link>
                                </>
                            }
                        </>
                    }
                </form>
            </div>
            <Footer/>
        </>
    );
}

export default AccountVerification;