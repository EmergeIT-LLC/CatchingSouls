import React from 'react';
import './Contact.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

const Contact = () => {
    return (
        <>
            <Header/>
            <div className='contactPage_container'>
                <div className='contact_form'>
                    <h1>Contact Catching Souls</h1>
                    <p>Please email us at <a href="mailto:catchingsoulstrivia@outlook.com">CatchingSoulsTrivia@Outlook.com</a> for any comments, concerns, or feedback you may have.</p>
                    <p>We will do our best to answer all emails at our earliest convenience.</p>
                    <p>Thank you for your patience and understanding, Catching Souls Team.</p>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Contact;