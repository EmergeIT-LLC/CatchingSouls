import React from 'react';
import './About.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';

const About = () => {
    return (
        <>
            <Header/>
            <div className='aboutPage_container'>
                <div className='about_form'>
                    <h1>About</h1>
                    <p> By playing the Catching Souls and answering questions correctly, you save souls because you know the Bible. </p> 
                    <p> By knowing the Bible, you are doing good in this world because you understand that God wants everyone </p>
                    <p> to know his words to save souls by sharing his words on to the heavy hearted so that they can also do </p>
                    <p> God due to becoming lighthearted. So each saved life represents the number of souls they can save in a day. </p>                </div>
            </div>
            <Footer/>
        </>
    );
}

export default About;