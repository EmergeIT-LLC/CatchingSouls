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
                    <h1>Contact Us - Catching Souls Bible Trivia</h1>
                    <p>We value your feedback, questions, and suggestions at Catching Souls Bible Trivia. If you have any inquiries or need assistance with our app, please don't hesitate to get in touch with us. Our dedicated support team is here to help you.</p>
                    <h2>Contact Information:</h2>
                    <p><b>Email:</b> <a href="mailto:catchingsoulstrivia@outlook.com">CatchingSoulsTrivia@Outlook.com</a></p>
                    <h2>How Can We Assist You?</h2>
                    <ol>
                        <li><b>Technical Support:</b> Encountering any technical issues while using the Catching Souls app? Reach out to us, and our tech experts will swiftly address and resolve any problems you may face.</li>
                        <li><b>Questions and Feedback:</b> We love hearing from our users! If you have any questions about our quizzes, want to provide feedback on your experience, or have suggestions for improvements, feel free to drop us an email. We welcome your thoughts and strive to enhance your Catching Souls journey based on your valuable input.</li>
                        <li><b>Content Contributions:</b> Are you a Bible enthusiast with a passion for crafting engaging trivia questions? We welcome content contributions from fellow users. If you have well-researched and accurate Bible trivia questions, please feel free to share them with us. Your contributions might even feature in our weekly uploads!</li>
                        <li><b>Partnership and Collaborations:</b> Catching Souls is open to collaborations and partnerships with like-minded organizations, churches, or individuals. If you have ideas for joint ventures or faith-based projects, let us know, and we can explore the possibilities together.</li>
                        <li><b>Reporting Issues:</b> If you come across any questionable content or encounter inaccuracies in our trivia questions, please inform us immediately. We strive to maintain the highest standard of biblical accuracy and appreciate your assistance in ensuring the quality of our app.</li>
                    </ol>
                    <h2>Connect with Us Today:</h2>
                    <p>Catching Souls Bible Trivia is committed to creating a supportive and engaging platform for Bible enthusiasts worldwide. We aim to foster a community that celebrates knowledge, faith, and growth through the exploration of the Scriptures.</p>
                    <p>Drop us an email at <a href="mailto:catchingsoulstrivia@outlook.com">CatchingSoulsTrivia@Outlook.com</a>, and we'll be delighted to connect with you. Thank you for being a part of Catching Souls, and we look forward to accompanying you on your biblical journey.</p>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Contact;