import React, { useState, useEffect } from 'react';
import './LevelChoiceSelected.css'
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckGuestLogin, CheckUser } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const LevelChoiceSelected = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {SelectedLevel} = useParams();
    const guestLoggedIn = CheckGuestLogin();
    const userLoggedIn = CheckUserLogin();
    let loggedInUser;
    const validCookie = isCookieValid()

    if (!guestLoggedIn) {
        loggedInUser = CheckUser();    
    }
    else {
        loggedInUser = "Guest";
    }
    
    const [isLoading, setIsLoading] = useState(false);
    //Question && Answer Choices
    const [isTrueFalse, setIsTrueFalse] = useState(false);
    const [questionID, setQuestionID] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answerA, setAnswerA] = useState(null);
    const [answerB, setAnswerB] = useState(null);
    const [answerC, setAnswerC] = useState(null);
    const [answerD, setAnswerD] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [supportingVerse, setSupportingVerse] = useState(null)
    //Answer Selection
    const [selectedAnswer, setSelectedAnswer] = useState(false);
    const [checkingAnswer, setCheckingAnswer] = useState(false);
    const [answerCorrect, setAnswerCorrect] = useState(true);
    //Additional
    const [timer, setTimer] = useState(null);
    const [playerPoints, setPlayerPoints] = useState(0);

    useEffect(()=> {
        setIsLoading(true);
        if (userLoggedIn && validCookie || guestLoggedIn){
            getPlayerPoints();
            getTriviaQandA();
            setTimerLimit();
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
    }, [userLoggedIn]);

    useEffect(() => {
        const intervalId = setTimeout(() => {setTimer(timer - 1);}, 1000);
        if (timer === 0){
            setTimer(null);
            checkSelectedAnswer(null);
        }

        return () => clearInterval(intervalId);
    }, [timer]);

    const getPlayerPoints = async () => {
        if (!guestLoggedIn){
            setIsLoading(true);
            const url = process.env.REACT_APP_Backend_URL + '/trivia/getPlayerPoints';
                    
            Axios.post(url, {
                loggedInUser : loggedInUser
            })
            .then((response) => {
                setPlayerPoints(response.data.playerPoints);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
        }
        else {
            setPlayerPoints(sessionStorage.getItem('catchingSoulsGuestPoints'))
        }
    }

    const getTriviaQandA = async () => {
        setIsLoading(true);
        setCorrectAnswer(null);
        const url = process.env.REACT_APP_Backend_URL + '/trivia/retrievequestion';
                
        Axios.post(url, {
            SelectedLevel : {SelectedLevel}
        })
        .then((response) => {
            if (response.data.questionType === "TrueOrFalse"){
                setIsTrueFalse(true)
            }
            else {
                setIsTrueFalse(false);
            }
            setQuestionID(response.data.questionID);
            setQuestion(response.data.question);
            setAnswerA(response.data.a);
            setAnswerB(response.data.b);
            setAnswerC(response.data.c);
            setAnswerD(response.data.d);
            setSupportingVerse(response.data.supportingVerse);
            setIsLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
        });
    }

    const setTimerLimit = () => {
        setTimer(30);
    }

    const checkSelectedAnswer = async (selectedAnswerChoice) => {
        setTimer(null);
        setSelectedAnswer(true);
        setCheckingAnswer(true);

        if(selectedAnswerChoice === null){
            setCheckingAnswer(false);
            setAnswerCorrect(false);
        }

        const url = process.env.REACT_APP_Backend_URL + '/trivia/checkanswer';
                
        Axios.post(url, {
            questionID : questionID,
            selectedAnswerChoice : selectedAnswerChoice,
            loggedInUser : loggedInUser
        })
        .then((response) => {
            if(response.data.results === "true"){
                setAnswerCorrect(true)
                if (guestLoggedIn) {
                    let currentPoints = parseInt(sessionStorage.getItem('catchingSoulsGuestPoints'));
                    
                    if (SelectedLevel === "Beginner"){
                        currentPoints += 1;
                    }
                    else if (SelectedLevel === "Intermediate"){
                        currentPoints += 2;
                    }
                    else if (SelectedLevel === "Advance"){
                        currentPoints += 3;
                    }
                    else {
                        currentPoints += 0;
                    }
                    sessionStorage.setItem('catchingSoulsGuestPoints', currentPoints);
                }
            }
            else {
                setCorrectAnswer(response.data.correctAnswer)
                setAnswerCorrect(false);
            }
            
            setCheckingAnswer(false);
        })
        .catch((error) => {
            console.log(error);
            setCheckingAnswer(false);
        });
    }

    const nextQuestion = () => {
        getPlayerPoints();
        getTriviaQandA();
        setTimerLimit();
        setSelectedAnswer(false);
    }

    const leaveTrivia = () => {
        navigate('/');
    }

    return (
        <>
            <Header/>
            <div className='levelChoiceSelectedPage_container'>
                <div className='levelChoiceSelected_form'>
                    {isLoading ? 
                        <h1>Loading...</h1>
                    :
                    <>
                        {selectedAnswer ?
                            <>
                                {checkingAnswer ?
                                    <h1>Checking answer...</h1>
                                :
                                    <>
                                    {answerCorrect ?
                                        <>
                                            <h1 style={{color: 'green'}}>Correct Answer</h1>
                                            {supportingVerse && <h2>Supporting Verse: {supportingVerse}</h2>}
                                            <button className='levelChoiceSelectedButton' onClick={() => nextQuestion()}>Next Question</button>
                                            <button className='levelChoiceSelectedCancelButton' onClick={() => leaveTrivia()}>End Game</button>
                                        </>
                                    :
                                        <>
                                            <h1 style={{color: 'crimson'}}>Incorrect Answer</h1>
                                            <h2>Correct Answer: {correctAnswer}</h2>
                                            {supportingVerse && <h2>Supporting Verse: {supportingVerse}</h2>}
                                            <button className='levelChoiceSelectedButton' onClick={() => nextQuestion()}>Next Question</button>
                                            <button className='levelChoiceSelectedCancelButton' onClick={() => leaveTrivia()}>End Game</button>
                                        </>
                                    }
                                    </>
                                }
                            </>
                        :
                            <>
                            {isTrueFalse ? 
                                <>
                                    <div className='triviaSection'>
                                        <h3 className='playerPoints'>Current Points: {playerPoints}</h3>
                                        <h3 className='timer'>Time: {timer}</h3>
                                    </div>
                                    <h1>Question:</h1>
                                    <h2>{question}</h2>
                                    <button className='levelChoiceSelectedButton' value={answerA} onClick={() => checkSelectedAnswer(answerA)}>{answerA}</button>
                                    <button className='levelChoiceSelectedButton' value={answerB} onClick={() => checkSelectedAnswer(answerB)}>{answerB}</button>
                                    <button className='levelChoiceSelectedCancelButton' onClick={() => leaveTrivia()}>End Game</button>
                                </>
                            :
                                <>
                                    <div className='triviaSection'>
                                        <h3 className='playerPoints'>Current Points: {playerPoints}</h3>
                                        <h3 className='timer'>Time: {timer}</h3>
                                    </div>
                                    <h1>Question:</h1>
                                    <h2>{question}</h2>
                                    <button className='levelChoiceSelectedButton' value={answerA} onClick={() => checkSelectedAnswer(answerA)}>{answerA}</button>
                                    <button className='levelChoiceSelectedButton' value={answerB} onClick={() => checkSelectedAnswer(answerB)}>{answerB}</button>
                                    <button className='levelChoiceSelectedButton' value={answerC} onClick={() => checkSelectedAnswer(answerC)}>{answerC}</button>
                                    <button className='levelChoiceSelectedButton' value={answerD} onClick={() => checkSelectedAnswer(answerD)}>{answerD}</button>                                
                                    <button className='levelChoiceSelectedCancelButton' onClick={() => leaveTrivia()}>End Game</button>
                                </>
                            }
                            </>
                        }
                    </>
                    }
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default LevelChoiceSelected;
