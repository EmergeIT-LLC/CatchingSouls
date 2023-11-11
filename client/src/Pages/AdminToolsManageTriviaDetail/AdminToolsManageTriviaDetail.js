import React, { useState, useEffect } from 'react';
import './AdminToolsManageTriviaDetail.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageTriviaDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const {QuestionID} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [questionID, setQuestionID] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [triviaType, setTriviaType] = useState("null");
    const [triviaLevel, setTriviaLevel] = useState("null");
    const [showButtons, setShowButtons] = useState(true);

    useEffect(() => {
        GetLogoutStatus(AccountUsername);
        if (!userLoggedIn) {
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
            setIsLoading(true);
            getTriviaProps();
            setIsLoading(false);
        }
    }, [userLoggedIn]);

    const getTriviaProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/TriviaDetailRetrieval';
        await Axios.post(url, {QuestionID : {QuestionID}})
        .then((response) => {
            setQuestionID(response.data.triviaID);
            setQuestion(response.data.triviaquestions);
            setAnswer(response.data.triviaanswers);
            setTriviaType(response.data.triviatype);
            setTriviaLevel(response.data.trivialevel);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <>
            <Header/>
            <div className='adminToolsManageTriviaDetailPage_container'>
                <div className='adminToolsManageTriviaDetail_form'>
                    {isLoading ?
                        <>
                            <h1>Loading...</h1>
                        </>
                        :
                        <>
                            <h1>Question ID {questionID}</h1>
                            <div className='adminToolsManageTriviaDetailInfo_form'>
                                <p><b>Question:</b> {question}</p>
                                <p><b>Answer:</b> {answer}</p>
                                <p><b>Answer Relation:</b> {triviaType}</p>
                                <p><b>Question Level:</b> {triviaLevel}</p>
                            </div>
                            {showButtons ?
                                <>
                                    <a href={`/${loggedInUser}/AdminTools/ManageTriviaQuestions/${questionID}/Update`}><button className='adminToolsManageTriviaDetailButton'>Update Question</button></a>
                                    <a href={`/${loggedInUser}/AdminTools/ManageTriviaQuestions/${questionID}/Delete`}><button className='adminToolsManageTriviaDetailButton'>Delete Question</button></a>
                                </>
                            :
                            <></>
                            }
                        <a href={`/${loggedInUser}/AdminTools/ManageTriviaQuestions`}><button className='adminToolsManageTriviaDetailButton'>Return to Questions</button></a>
                        </>
                    }
                    </div>
                </div>
            <Footer/>
        </>
    );
}

export default AdminToolsManageTriviaDetail;