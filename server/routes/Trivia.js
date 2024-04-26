const express = require('express');
const router = express.Router();
const triviaQueries = require('../config/database/storedProcedures/triviaStoredProcedures');
const userQueries = require('../config/database/storedProcedures/userStoredProcedures');
const adminQueries = require('../config/database/storedProcedures/adminStoredProcedures');
//----------------------------------------- BEGINNING OF PASSPORT MIDDLEWARE AND SETUP ---------------------------------------------------
function setTriviaType(triviaTypeSelection) {
    switch(triviaTypeSelection){
        case 0:
            return "TrueOrFalse";
        case 1:
            return "Number";
        case 2:
            return "People";
        case 3:
            return "Item";
        case 4:
            return "Quote";
        case 5:
            return "Verse";
        case 6:
            return "Book";
        case 7:
            return "Location";
    }
}
function randomIntFromInterval(min, max) { // min and max included 
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
//----------------------------------------- END OF PASSPORT MIDDLEWARE SETUP ---------------------------------------------------
//----------------------------------------- REGISTER AND VERIFICATION SETUP ---------------------------------------------------
//Register page communication
router.post('/retrievequestion', async (req, res) => {
    const selectedLevel = req.body.SelectedLevel.SelectedLevel;
    let triviaTypeSelection = randomIntFromInterval(0, 7);
    let triviaType = setTriviaType(triviaTypeSelection);
                
    try {    
        let triviaQA;
    
        // Keep looping until triviaQA has at least 5 questions
        do {
            triviaTypeSelection = randomIntFromInterval(0, 7);
            triviaType = setTriviaType(triviaTypeSelection);
            triviaQA = await triviaQueries.qaCheckQuestionLevelandType(selectedLevel, triviaType);
        } while (triviaQA.length < 5);
            
        // Select a random question
        const selectedQuestionIndex = randomIntFromInterval(0, triviaQA.length - 1);
        const selectedQuestion = triviaQA[selectedQuestionIndex];
        const questionID = selectedQuestion.triviaID;
        const question = selectedQuestion.triviaquestions;
        const selectedQuestionAnswer = selectedQuestion.triviaanswers;
    
        // Shuffle triviaQA array
        const shuffledTriviaQA = shuffleArray(triviaQA);

        // Select answers from shuffledTriviaQA
        const answerPool = [selectedQuestionAnswer];
        for (let i = 0; i < shuffledTriviaQA.length && answerPool.length < 4; i++) {
            const randomAnswer = shuffledTriviaQA[i].triviaanswers;
            if (!answerPool.includes(randomAnswer) && randomAnswer !== selectedQuestionAnswer) {
                answerPool.push(randomAnswer);
            }
        }
    
        // Prepare response
        const response = {
            questionType: triviaType,
            questionID: questionID,
            question: question,
            a: answerPool[0],
            b: answerPool[1],
            c: answerPool[2],
            d: answerPool[3]
        };

        // Send the response
        return res.json(response);
    } catch (err) {
        console.log(err);
        return res.json({ message: 'An Error Occurred!', errorMessage: err.message });
    }
});

router.post('/checkanswer', async (req, res) => {
    const questionID = req.body.questionID;
    const answerChose = req.body.selectedAnswerChoice;
    const loggedUser = req.body.loggedInUser;
    var pointsToAward = 0;

    try {
        //Retrieve Prompted QA Detail
        const triviaQAAsked = await triviaQueries.qaGetQuestionDataId(questionID);

        //Make sure it was found
        if (triviaQAAsked.length > 0) { 
            //Check to make answer is correct
            if (answerChose == triviaQAAsked[0].triviaanswers) {
                //Get points awarded based on level
                if (triviaQAAsked[0].trivialevel === "Beginner") {
                    pointsToAward = 1;
                }
                else if (triviaQAAsked[0].trivialevel === "Intermediate") {
                    pointsToAward = 2;
                }
                else if (triviaQAAsked[0].trivialevel === "Advance") {
                    pointsToAward = 3;
                }
                if (loggedUser !== "Guest"){
                    //Locate User or admin to update
                    const loggedInUser = await userQueries.locateVerifiedUserData(loggedUser);
                    const loggedInAdminUser = await adminQueries.locateVerifiedAdminData(loggedUser);
                    //Award user or admin the points
                    if (loggedInUser.length > 0) {
                        const updatedPoints = loggedInUser[0].savedSouls + pointsToAward;
                        const isUserPointUpdated = await userQueries.updateUserPoints(updatedPoints, loggedUser);
                        if (isUserPointUpdated) {
                            return res.json({results: "true"});
                        }
                    }
                    else if (loggedInAdminUser.length > 0) {
                        const updatedPoints = loggedInAdminUser[0].savedSouls + pointsToAward;
                        const isAdminPointUpdated = await adminQueries.updateAdminPoints(updatedPoints, loggedUser);
                        if (isAdminPointUpdated) {
                            return res.json({results: "true"});
                        }
                    }
                }
                else {
                    return res.json({results: "true"});
                }
            }
            else {
                return res.json({results: "false"});
            }
        }
    } catch (error) {
        console.log(error)
        return res.json({ message: 'An Error Occured!', errorMessage: err.message });
    }
});

router.post('/getPlayerPoints', async (req, res) => {
    const loggedInUser = req.body.loggedInUser;

    try {
        const locateUser = await userQueries.locateVerifiedUserData(loggedInUser);
        const locateAdmin = await adminQueries.locateVerifiedAdminData(loggedInUser);
        if (locateUser.length > 0){
            return res.json({playerPoints: locateUser[0].savedSouls});
        }
        if (locateAdmin.length > 0){
            return res.json({playerPoints: locateAdmin[0].savedSouls});
        }
        else {
            return res.json({playerPoints: -1});
        }
    } catch (error) {
        return res.json({ message: 'An Error Occured!', errorMessage: err.message });
    }
});
module.exports = router;