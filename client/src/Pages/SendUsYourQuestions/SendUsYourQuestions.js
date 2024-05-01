import React, { useState } from 'react';
import './SendUsYourQuestions.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Entry Checks
import { CheckEmail } from '../../Functions/EntryCheck';
//Repositories
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SendUsYourQuestions = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [verse, setVerse] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const submitForm = (e) => {
        e.preventDefault();
        if (firstName === null || lastName === null || email === null){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        else if (CheckEmail(email) === false){
            return setStatusMessage("Email Is Not Acceptable");
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/User/sendUsYourQuestions';
                
        Axios.post(url, {
            firstName : firstName,
            lastName : lastName,
            email : email,
            question : question,
            answer : answer,
            verse : verse
        })
        .then((response) => {
            if (response.data.successStatus === "Successful") {
                setStatusMessage("Question Sent Successfully");
                setIsLoading(false);
            }
            else if (response.data.successStatus === "Unsuccessful") {
                setStatusMessage("An error occurred");
                setIsLoading(false);
            }
        })
        .catch((error) => {
            setStatusMessage(error.response.data.message);
            setIsLoading(false);
        });
    };
      
    return (
        <>
            <Header/>
            <div className='SendUsYourQuestionsPage_container'>
                <div className='SendUsYourQuestions_form'>
                    <h1>Send Us Your Question</h1>
                    <input className='firstName' placeholder='First Name' required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                    <input className='lastName' placeholder='Last Name' required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                    <input className='email' placeholder='Email Address' type='email' required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                    <textarea className='question' placeholder='Type In Your Trivia Question' required autoComplete="off" onChange={(e) => setQuestion(e.target.value)} />
                    <textarea className='answer' placeholder='Enter Trivia Answer' required autoComplete="off" onChange={(e) => {setAnswer(e.target.value); }} />
                    <input className='verse' placeholder='Enter Supporting Verse' required autoComplete="off" onChange={(e) => {setVerse(e.target.value); }} />
                    {isLoading && <button className='SendUsYourQuestionsButton' disabled>Loading...</button>}
                    {!isLoading && <button className='SendUsYourQuestionsButton' type='submit' onClick={submitForm}>Submit</button>}
                </div>
            {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>  
            <Footer/>
        </>
    );
}

export default SendUsYourQuestions;