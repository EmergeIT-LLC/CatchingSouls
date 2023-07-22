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
                    <h1>About Catching Souls: <br/>Your Ultimate Bible Trivia</h1>
                    <p>Welcome to Catching Souls, the ultimate Bible trivia web app designed to deepen your understanding of the Bible while having fun! Our mission is to provide an engaging platform where users can test their knowledge, learn new insights, and grow in their faith through interactive quizzes.</p> 
                    <h2>Why Catching Souls?</h2>
                    <p>At Catching Souls, we understand the importance of knowing and understanding the Bible's teachings. Whether you are a devoted believer seeking to reinforce your biblical knowledge or a curious individual looking to explore the Scriptures, our app caters to all levels of familiarity with the Bible.</p>
                    <h2>Features and Benefits:</h2>
                    <ol>
                        <li><b>Educational and Fun Quizzes:</b> Our true or false and multiple-choice quizzes are both educational and enjoyable. Each question is carefully crafted to challenge your biblical understanding and encourage you to delve deeper into the Scriptures.</li>
                        <li><b>Weekly Updated Content:</b> Never run out of new challenges! We upload fresh sets of questions every week, ensuring that you always have something new to explore and learn.</li>
                        <li><b>Comprehensive Bible Coverage:</b> Catching Souls covers various topics from both the Old and New Testaments. From iconic biblical events to lesser-known narratives, our quizzes encompass a wide range of subjects to provide a holistic understanding of the Bible.</li>
                        <li><b>User-Friendly Interface:</b> Our app features an intuitive and user-friendly interface that makes navigation smooth and enjoyable. Accessing quizzes and reviewing your progress has never been easier.</li>
                        <li><b>Faith-Enriching Experience:</b> Catching Souls aims not only to impart knowledge but also to deepen your spiritual connection. Through thought-provoking questions and informative explanations, our app strives to enrich your faith journey.</li>
                    </ol>
                    <h2>Our Commitment to Accuracy:</h2>
                    <p>We take the accuracy of our content seriously. All questions in Catching Souls are meticulously researched and verified to ensure that the information provided is reliable and faithful to the Scriptures. Our team of biblical scholars and experts collaborates to maintain the highest standard of biblical accuracy.</p>
                    <h2>Join Us Today:</h2>
                    <p>Embark on an enriching journey through the Bible with Catching Souls. Strengthen your biblical knowledge, deepen your understanding of God's Word, and have fun along the way. Whether you're a beginner or a seasoned Bible scholar, our app is here to aid you on your quest for spiritual growth and knowledge.</p>
                    <p>Join Catching Souls now and start catching wisdom from the Scriptures!</p>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default About;