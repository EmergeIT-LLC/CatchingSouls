import React, { useState, useEffect } from 'react';
import './AdminToolsManageTriviaDelete.css';
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
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';

const AdminToolsManageTriviaDelete = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const {QuestionID} = useParams();
    const userLoggedIn = CheckLogin();
    const loggedInUser = CheckUser(userLoggedIn);
    const logOutStatus = GetLogoutStatus(AccountUsername);
    const isAdmin = GetAdminRole();
    const [questionID, setQuestionID] = useState("");
    const [question, setQuestion] = useState('');
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
        })
        .catch((error) => {
            console.log(error);
        })
    };

    const submitForm = () => {
        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/TriviaDelete';
                
        Axios.post(url, {
            questionID : QuestionID,
        })
        .then((response) => {
            if (response.data.message){
                setIsLoading(false);
                setStatusMessage(response.data.message);
            }
            else if (response.data.deleteStatus === "Successful") {
                navigate(`/${loggedInUser}/AdminTools/ManageTriviaQuestions/${questionID}/Detail`);
            }
            else if (response.data.deleteStatus === "Unsuccessful") {
                setIsLoading(false);
                setStatusMessage("Deletion failed!");
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
            <div className='adminToolsManageTriviaDeletePage_container'>
                <form className='adminToolsManageTriviaDelete_form'>
                    {isLoading ?
                        <>
                            <h1>Loading...</h1>
                            <h2>{statusMessage}</h2>
                        </>
                    :   
                        <>
                            <p>You sure you want to delete Question ID <b>{questionID}</b> admin account?</p>
                            <p><b>Question:</b></p>
                            <p>{question}</p>
                            <button className='adminToolsManageTriviaDeleteButton' type='submit' onClick={submitForm}>Yes</button>
                            <Link to={`/${loggedInUser}/AdminTools/ManageTriviaQuestions/${questionID}/Detail`}><button className='adminToolsManageTriviaDeleteButton'>No</button></Link>
                            <Link to={`/${loggedInUser}/AdminTools/ManageTriviaQuestions`}><button className='adminToolsManageTriviaDeleteButton'>Return to Questions</button></Link>
                        </>
                    }
                </form>
            <h2>{statusMessage}</h2>
            </div>
            <Footer/>
        </>
    )
}

export default AdminToolsManageTriviaDelete;
