import React, { useState, useEffect } from 'react';
import './AdminToolsManageTrivia.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageTrivia = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [triviaData, setTriviaData] = useState([]);

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
            getTriviaProps();
        }
    }, [userLoggedIn]);

    const getTriviaProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/TriviaRetrieval';
        
        await Axios.post(url)
        .then((response) =>  {
            setTriviaData(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    };


    const questionDetail = (selectedQuestion) => {
        navigate(`/${loggedInUser}/AdminTools/ManageTriviaQuestions/${selectedQuestion}/Detail`);
    }

    return (
        <>
            <Header/>
            <div className='adminToolsManageTriviaPage_container'>
                <a href={`/${loggedInUser}/AdminTools/ManageTriviaQuestions/AddQuestion`}><button className='adminToolsManageAccountButton'>Add Questions</button></a>
                <form className='adminToolsManageTrivia_form'>
                    {isLoading ? 
                        <h1>Loading...</h1>
                    :
                    <>
                        <h1>Questionnaires</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan={1}>Question ID</th>
                                    <th>Question</th>
                                    <th>Answer</th>
                                    <th>Answer Relation</th>
                                    <th>Question Level</th>
                                    <th>Supporting Verse</th>
                                </tr>
                            </tbody>
                            <tbody>
                            {triviaData.map((questions) => (
                                <tr key={questions.triviaID} onClick={() => questionDetail(questions.triviaID)}>
                                    <td>{questions.triviaID}</td>
                                    <td>{questions.triviaquestions}</td>
                                    <td>{questions.triviaanswers}</td>
                                    <td>{questions.triviatype}</td>
                                    <td>{questions.trivialevel}</td>
                                    <td>{questions.supportingVerse}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                    }
                </form>
            </div>
            <Footer/>           
        </>
    );
}

export default AdminToolsManageTrivia;
