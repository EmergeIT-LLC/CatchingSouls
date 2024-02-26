const db = require('../dbConnection');

async function addQA(question, answer, qaType, difficulty) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO questionandanswer (triviaquestions, triviaanswers, triviatype, trivialevel) VALUES (?, ?, ?, ?)', [question, answer, qaType, difficulty], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function qaCheckQuestion(question) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questionandanswer WHERE triviaquestions = ?', [question], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function qaCheckQuestionID(questionID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function qaCheckQuestionLevelandType(selectedLevel, triviaType) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questionandanswer WHERE trivialevel = ? AND triviatype = ?', [selectedLevel, triviaType], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function qaGetAllQuestionData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questionandanswer', [], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if question is found, false otherwise
            }
        });
    });
}

async function qaGetQuestionDataQ(question) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questionandanswer WHERE triviaquestions = ?', [question], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if question is found, false otherwise
            }
        });
    });
}

async function qaGetQuestionDataId(questionID) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if question is found, false otherwise
            }
        });
    });
}

async function updateQAQuestionID(questionID, question, answer, qaType, difficulty) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE questionandanswer SET triviaquestions = ?, triviaanswers = ?, triviatype = ?, trivialevel = ? WHERE triviaID = ?', [question, answer, qaType, difficulty, questionID], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function removeQAQuestionID(questionID) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM questionandanswer WHERE triviaID = ?', [questionID], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

module.exports = {
    addQA,
    qaCheckQuestion,
    qaCheckQuestionID,
    qaCheckQuestionLevelandType,
    qaGetAllQuestionData,
    qaGetQuestionDataQ,
    qaGetQuestionDataId,
    updateQAQuestionID,
    removeQAQuestionID
}