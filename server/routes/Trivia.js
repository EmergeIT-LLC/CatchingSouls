const express = require('express');
const router = express.Router();
const db = require('../config/database/dbConnection');
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
function countTriviaLevelLength(obj) {
    var count = 0;
    // iterate over properties, increment if a non-prototype property
    for(var key in obj) if(obj.hasOwnProperty(key)) count++;
    return count;
}
//----------------------------------------- END OF PASSPORT MIDDLEWARE SETUP ---------------------------------------------------
//----------------------------------------- REGISTER AND VERIFICATION SETUP ---------------------------------------------------
//Register page communication
router.post('/retrievequestion', async (req, res) => {
    const selectedLevel = req.body.SelectedLevel.SelectedLevel;
    var answerTwo = null;
    var answerThree = null;
    var answerFour = null;
    let foundFourNumbers = false;
    var answerA = null;
    var answerB = null;
    var answerC = null;
    var answerD = null;
    let triviaTypeSelection = randomIntFromInterval(0, 7);
    let triviaType = setTriviaType(triviaTypeSelection);
                
    try {    
        let triviaQA = await db.all('SELECT * FROM questionandanswer WHERE trivialevel = ? AND triviatype = ?', [selectedLevel, triviaType]);

        do {
            triviaTypeSelection = randomIntFromInterval(0, 7);
            triviaType = setTriviaType(triviaTypeSelection);
            triviaQA = await db.all('SELECT * FROM questionandanswer WHERE trivialevel = ? AND triviatype = ?', [selectedLevel, triviaType]);
        } while (countTriviaLevelLength(triviaQA[0]) < 5);
        
        if (typeof triviaQA !== 'undefined') {
            const numOfQuestionForLevel = countTriviaLevelLength(triviaQA[0]);
            const selectedQuestion = randomIntFromInterval(0, numOfQuestionForLevel);
            const questionID = triviaQA[0][selectedQuestion].triviaID;
            const question = triviaQA[0][selectedQuestion].triviaquestions;
        
            if (triviaType == "TrueOrFalse"){
                return res.json({questionType: triviaType, questionID: questionID, question: question, a: "True", b: "False"});
            }

            const selectedQuestionAnswer = triviaQA[0][selectedQuestion].triviaanswers;

            do {
                answerTwo = triviaQA[0][randomIntFromInterval(0, numOfQuestionForLevel)].triviaanswers;
            } while (answerTwo === selectedQuestionAnswer);

            do {
                answerThree = triviaQA[0][randomIntFromInterval(0, numOfQuestionForLevel)].triviaanswers;
            } while (answerThree === selectedQuestionAnswer || answerThree === answerTwo);

            do {
                answerFour = triviaQA[0][randomIntFromInterval(0, numOfQuestionForLevel)].triviaanswers;
            } while (answerFour === selectedQuestionAnswer || answerFour === answerTwo || answerFour === answerThree);

            let mixA = randomIntFromInterval(0, 4);
            switch(mixA){
                case 0:
                    answerA = selectedQuestionAnswer;
                    break;
                case 1:
                    answerA = answerTwo;
                    break;
                case 2:
                    answerA = answerThree;
                    break;
                case 3:
                    answerA = answerFour;
                    break;
            }

            let mixB = randomIntFromInterval(0, 4);

            do {
                mixB = randomIntFromInterval(0, 4);
                switch(mixB){
                    case 0:
                        answerB = selectedQuestionAnswer;
                        break;
                    case 1:
                        answerB = answerTwo;
                        break;
                    case 2:
                        answerB = answerThree;
                        break;
                    case 3:
                        answerB = answerFour;
                        break;
                }
            } while (mixB === mixA);
            
            let mixC = randomIntFromInterval(0, 4);

            do {
                mixC = randomIntFromInterval(0, 4);
                switch(mixC){
                    case 0:
                        answerC = selectedQuestionAnswer;
                        break;
                    case 1:
                        answerC = answerTwo;
                        break;
                    case 2:
                        answerC = answerThree;
                        break;
                    case 3:
                        answerC = answerFour;
                        break;
                }
            } while (mixC === mixA || mixC === mixB);

            let mixD = randomIntFromInterval(0, 4);

            do {
                mixD = randomIntFromInterval(0, 4);
                switch(mixD){
                    case 0:
                        answerD = selectedQuestionAnswer;
                        break;
                    case 1:
                        answerD = answerTwo;
                        break;
                    case 2:
                        answerD = answerThree;
                        break;
                    case 3:
                        answerD = answerFour;
                        break;
                }
            } while (mixD === mixA || mixD === mixB || mixD === mixC);


            if(answerA !== null && answerB !== null && answerC !== null && answerD !== null){
                return res.json({questionType: triviaType, questionID: questionID, question: question, a: answerA, b: answerB, c: answerC, d: answerD});
            }
        }
        else {
            numOfQuestionForLevel = 0;
        }
    }
    catch (err){
        console.log(err)
        return res.json({ message: 'An Error Occured!', errorMessage: err.message });
    }
});

router.post('/checkanswer', async (req, res) => {
    const questionID = req.body.questionID;
    const answerChose = req.body.selectedAnswerChoice;
    const loggedUser = req.body.loggedInUser;
    var pointsToAward = 0;

    try {
        //Retrieve Prompted QA Detail
        const triviaQAAsked = await db.all('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID]);

        //Make sure it was found
        if (triviaQAAsked[0][0] !== 'undefined') { 
            //Check to make answer is correct
            if (answerChose == triviaQAAsked[0][0].triviaanswers) {
                //Get points awarded based on level
                if (triviaQAAsked[0][0].trivialevel === "Beginner") {
                    pointsToAward = 1;
                }
                else if (triviaQAAsked[0][0].trivialevel === "Intermediate") {
                    pointsToAward = 2;
                }
                else if (triviaQAAsked[0][0].trivialevel === "Advance") {
                    pointsToAward = 3;
                }
                
                if (loggedUser !== "Guest"){
                    //Locate User or admin to update
                    const loggedInUser = await db.all('SELECT * FROM users WHERE accountUsername = ?', [loggedUser]);
                    const loggedInAdminUser = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [loggedUser]);
                    //Award user or admin the points
                    if (typeof loggedInUser[0][0] !== 'undefined') {
                        const updatedPoints = loggedInUser[0][0].savedSouls + pointsToAward;
                        const updateUserPoints = await db.all('UPDATE users SET savedSouls = ? WHERE accountUsername = ?', [updatedPoints, loggedUser]);
                        return res.json({results: "true"});
                    }
                    else if (typeof loggedInAdminUser[0][0] !== 'undefined') {
                        const updatedPoints = loggedInAdminUser[0][0].savedSouls + pointsToAward;
                        const updateUserPoints = await db.all('UPDATE adminusers SET savedSouls = ? WHERE accountUsername = ?', [updatedPoints, loggedUser]);
                        return res.json({results: "true"});
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
        const locateUser = await db.all('SELECT * FROM users WHERE accountUsername = ?', [loggedInUser]);
        const locateAdmin = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [loggedInUser]);
        if (typeof locateUser[0][0] !== 'undefined'){
            return res.json({playerPoints: locateUser[0][0].savedSouls});
        }
        if (typeof locateAdmin[0][0] !== 'undefined'){
            return res.json({playerPoints: locateAdmin[0][0].savedSouls});
        }
        else {
            return res.json({playerPoints: -1});
        }
    } catch (error) {
        return res.json({ message: 'An Error Occured!', errorMessage: err.message });
    }
});
module.exports = router;