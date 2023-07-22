import React, { useState, useEffect } from 'react';
import './AdminToolsManageTriviaAdd.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
import CheckUser from '../../Functions/VerificationCheck/checkUser';
import GetLogoutStatus from '../../Functions/VerificationCheck/getLogoutStatus';
import GetAdminRole from '../../Functions/VerificationCheck/getAdminRole';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageTriviaAdd = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckLogin();
    const loggedInUser = CheckUser(userLoggedIn);
    const logOutStatus = GetLogoutStatus(AccountUsername);
    const isAdmin = GetAdminRole();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectQAType, setSelectQAType] = useState("null");
    const [selectDifficulty, setSelectDifficulty] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (logOutStatus) {
            navigate('/Logout');
        }
        else if (!isAdmin) {
            navigate('/');
        }
    }, [userLoggedIn]);

    const submitForm = () => {
        if (question == null || answer == null || selectQAType == "null" || selectDifficulty == "null"){
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
                setIsLoading(false);
                setStatusMessage(response.data.message);
            }
            else if (response.data.uploadStatus === "Successful") {
                navigate(`/${loggedInUser}/AdminTools/ManageTriviaQuestions`);
            }
            else if (response.data.uploadStatus === "Unsuccessful") {
                setIsLoading(false);
                setStatusMessage("Question upload failed!");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            setStatusMessage(error.response.data.message);
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
                    {isLoading && <button className='adminToolsManageTriviaAddButton' disabled>Loading...</button>}
                    {!isLoading && <button className='adminToolsManageTriviaAddButton' type='submit' onClick={submitForm}>Add Q&A</button>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}            
            </div>
            <Footer/>
        </>
    )
}

export default AdminToolsManageTriviaAdd;
