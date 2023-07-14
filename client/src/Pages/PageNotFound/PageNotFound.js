import React from 'react';
import './PageNotFound.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Images
import companyLogoGreyedOut from '../../Images/Logo_Transparent_GreyedOut.png';

const PageNotFound = () => {
    return (
        <>
            <Header/>
            <div className='pageNotFoundPage_container'>
                <div className='pageNotFoundPage_form'>
                    <img src={companyLogoGreyedOut} alt ="Catching Souls Logo Greyed Out" />
                    <p>The page you are looking for does not exist. Please return to the <a href = '/'>homepage</a> for your convenience.</p>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default PageNotFound;
