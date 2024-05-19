import React, { useState, useEffect } from 'react';
import './AdminToolsManageTriviaUpdate.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';

const AdminToolsManageTriviaUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const {QuestionID} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const validCookie = isCookieValid()
    const isAdmin = GetAdminRole();
    const [questionID, setQuestionID] = useState("");
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectQAType, setSelectQAType] = useState("null");
    const [selectDifficulty, setSelectDifficulty] = useState("null");
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        GetLogoutStatus(AccountUsername);
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
        else {
            getTriviaProps();
        }
    }, [userLoggedIn]);

    const getTriviaProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/TriviaDetailRetrieval';
        
        await Axios.post(url, {QuestionID : {QuestionID}})
        .then((response) => {
            setQuestionID(response.data.triviaID);
            setQuestion(response.data.triviaquestions);
            setAnswer(response.data.triviaanswers);
            setSelectQAType(response.data.triviatype);
            setSelectDifficulty(response.data.trivialevel);
        })
        .catch((error) => {
            console.log(error);
        })
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (question === null || answer === null || selectQAType === "null" || selectDifficulty === "null"){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/TriviaUpdate';
                
        Axios.post(url, {
            questionID : QuestionID,
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
            else if (response.data.updateStatus === "Successful") {
                navigate(`/${loggedInUser}/AdminTools/ManageTriviaQuestions/${questionID}/Detail`);
            }
            else if (response.data.updateStatus === "Successful") {
                setStatusMessage("Update failed!");
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
            <div className='adminToolsManageTriviaUpdatePage_container'>
                <form className='adminToolsManageTriviaUpdate_form'>
                    <h1>Update Question ID {questionID}</h1>
                    <textarea name='question' placeholder='Enter Question' required autoComplete="off" defaultValue={question} onChange={(e) => setQuestion(e.target.value)} />
                    <input name='answer' placeholder='Enter Answer' required autoComplete="off" defaultValue={answer} onChange={(e) => setAnswer(e.target.value)} />
                    <select value={selectQAType} options={selectQAType} required onChange={(e) => {setSelectQAType(e.target.value)}}>
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
                    <select value={selectDifficulty} options={selectDifficulty} required onChange={(e) => {setSelectDifficulty(e.target.value)}}>
                        <option value="null">Select Q&A Difficulty</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advance">Advance</option>
                    </select>
                    {isLoading && <button className='adminToolsManageTriviaUpdateButton' disabled>Loading...</button>}
                    {!isLoading && <button className='adminToolsManageTriviaUpdateButton' type='submit' onClick={submitForm}>Update Q&A</button>}
                    {!isLoading && <Link to={`/${loggedInUser}/AdminTools/ManageTriviaQuestions/${questionID}/Detail`}><button className='adminToolsManageTriviaUpdateButton'>Cancel</button></Link>}
                    {!isLoading && <Link to={`/${loggedInUser}/AdminTools/ManageTriviaQuestions`}><button className='adminToolsManageTriviaUpdateButton'>Return to Questions</button></Link>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}            
            </div>
            <Footer/>
        </>
    );
}

export default AdminToolsManageTriviaUpdate;
