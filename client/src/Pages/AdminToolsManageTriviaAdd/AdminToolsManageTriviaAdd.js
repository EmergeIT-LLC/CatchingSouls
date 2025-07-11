import React, { useState, useEffect } from 'react';
import './AdminToolsManageTriviaAdd.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';

const AdminToolsManageTriviaAdd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const validCookie = isCookieValid()
    const isAdmin = GetAdminRole();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectQAType, setSelectQAType] = useState("null");
    const [supportingVerse, setSupportingVerse] = useState("null");
    const [selectDifficulty, setSelectDifficulty] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        GetLogoutStatus(AccountUsername)
        if (!userLoggedIn || !validCookie) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (GetLogoutStatus(AccountUsername)) {
            navigate('/Logout')
        }
        else if (!isAdmin) {
            navigate('/');
        }
    }, [userLoggedIn]);

    const submitForm = (e) => {
        e.preventDefault();
        if (question === null || answer === null || selectQAType === "null" || selectDifficulty === "null"){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/TriviaUpload';
                
        Axios.post(url, {
            question : question,
            answer : answer,
            selectQAType : selectQAType,
            selectDifficulty : selectDifficulty
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
                setIsLoading(false);
            }
            else if (response.data.uploadStatus === "Successful") {
                navigate(`/${loggedInUser}/AdminTools/ManageTriviaQuestions`);
            }
            else if (response.data.uploadStatus === "Unsuccessful") {
                setStatusMessage("Question upload failed!");
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
            <div className='adminToolsManageTriviaAddPage_container'>
                <form className='adminToolsManageTriviaAdd_form'>
                    <h1>Upload Question & Answer</h1>
                    <textarea name='question' placeholder='Enter Question' required autoComplete="off" onChange={(e) => setQuestion(e.target.value)} />
                    <input name='answer' placeholder='Enter Answer' required autoComplete="off" onChange={(e) => setAnswer(e.target.value)} />
                    <input name='supportingVerse' placeholder='Enter Supporting Verse' required autoComplete="off" onChange={(e) => setSupportingVerse(e.target.value)} />
                    <select value={selectQAType} required onChange={(e) => {setSelectQAType(e.target.value)}}>
                        <option value="null">Select Q&A Type</option>
                        <option value="TrueOrFalse">True or False</option>
                        <option value="Number">Number</option>
                        <option value="People">People</option>
                        <option value="Item">Item</option>
                        <option value="Quote">Quote</option>
                        <option value="Verse">Verse</option>
                        <option value="Book">Book</option>
                        <option value="Location">Location</option>
                    </select>
                    <select value={selectDifficulty} required onChange={(e) => {setSelectDifficulty(e.target.value)}}>
                        <option value="null">Select Q&A Difficulty</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advance">Advance</option>
                    </select>
                    {isLoading ? <button className='adminToolsManageTriviaAddButton' disabled>Loading...</button> : <button className='adminToolsManageTriviaAddButton' type='submit' onClick={submitForm}>Add Q&A</button>}
                    {!isLoading && <Link to={`/${loggedInUser}/AdminTools/ManageTriviaQuestions`}><button className='adminToolsManageTriviaAddCancelButton'>Return to Questions</button></Link>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}            
            </div>
            <Footer/>
        </>
    )
}

export default AdminToolsManageTriviaAdd;
