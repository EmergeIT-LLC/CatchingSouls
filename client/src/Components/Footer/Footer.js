import React from 'react';
import './Footer.css'
//Social Media Images
import facebookIcon from '../../Images/facebook-logo-symbol-free-svg-file.png';
import instgramIcon from '../../Images/instagram-logo-symbol-free-icons8-logos-file.png';

const Footer = () => {
    return (
        <>
            <div className='footerBody'>
                <h1 className='companyName'>Catching Souls</h1>
                <div className='contact'>
                    <div className='email'>Email: <a href="mailto:catchingsoulstrivia@outlook.com">CatchingSoulsTrivia@Outlook.com</a></div>
                </div>
                <div className='socialMedia'>
                    <a href='https://www.facebook.com/emergeitllc'><img src={facebookIcon} alt ="Jon Doe Tech Facebook Page" className='facebookIcon' /></a>
                    <a href='https://www.instagram.com/emergeitllc/'><img src={instgramIcon} alt ="Jon Doe Tech Instagram Page" className='instagramIcon'/></a>
                </div>
            </div>
        </>
    );
}

export default Footer;