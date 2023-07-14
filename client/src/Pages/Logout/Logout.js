import React from 'react';
import './Logout.css'
//Components
import companyLogo from '../../Images/Logo_Transparent.png';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';

const Logout = () => {
    const userLoggedIn = CheckLogin();

    if (userLoggedIn){
        sessionStorage.removeItem('catchingSoulsLoggedin');
        sessionStorage.removeItem('catchingSoulsUsername');
        sessionStorage.removeItem('catchingSoulsAdmin');
    }

    return (
        <>
            <Header/>
            <div className='logoutPage_container'>
                <div className='logout_form'>
                    <img src={companyLogo} alt ="Catching Souls Logo" />
                    <h1>Logged out!</h1>
                    <p>Select <strong>login</strong> to sign back in!</p>
                    <a href='/login'><button className='logoutButton'>Login</button></a>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Logout;