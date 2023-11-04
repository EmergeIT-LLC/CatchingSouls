const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const SqlDbStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const sg = require('../config/emailTemplate');
//----------------------------------------- BEGINNING OF PASSPORT MIDDLEWARE AND SETUP ---------------------------------------------------
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  key: 'BibleTriviaSessionCookies',
  secret: '3B4F7C4E6DA85A5176758B437A22A',
  store: new SqlDbStore({
  host: process.env.DB_Host,
  port: process.env.DB_Port,
  user: process.env.DB_User,
  password: process.env.DB_Pass,
  database: process.env.DB_Data,
  }),
  resave: false,
  saveUninitialized: false,
  cookie:{
      maxAge:1000*60*60*24,
      secure: true
  }
}));
function requireAuth(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated, proceed to the route
  } else {
    res.json({ message: 'Unauthorized' });
  }
}

// Example usage to protect a route
router.get('/adminprotected', requireAuth, (req, res) => {
  res.json({ message: 'This is a protected route' });
});
//----------------------------------------- END OF PASSPORT MIDDLEWARE AND SETUP ---------------------------------------------------
//----------------------------------------- REGISTER AND VERIFICATION SETUP ---------------------------------------------------
//Register page communication
router.post('/adminTool/register', async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = firstName + "." + lastName;
  const email = req.body.email;
  const role = req.body.selectRole;

  try {
    const locateAdminEmail = await db.query('SELECT * FROM adminusers WHERE accountEmail = ?', [email]);
    const locateAdminUser = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locatedUnverifiedAdmin = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

    if (typeof locateAdminEmail[0][0] !== 'undefined'){
      return res.json({ message: 'Email already registered!' });
    }
    else if (typeof locateAdminUser[0][0] !== 'undefined'){
      return res.json({ message: 'User already registered!' });
    }
    else if (typeof locatedUnverifiedAdmin[0][0] !== 'undefined'){
      sg.sendAdminVerification(locatedUnverifiedAdmin[0][0].accountEmail, locatedUnverifiedAdmin[0][0].accountFirstName, locatedUnverifiedAdmin[0][0].accountLastName, username);
      return res.json({ message: 'User needs to check email to verify account'});
    }
    else {
      const verificationStatus = await db.query('INSERT INTO adminusersverification (accountUsername, accountFirstName, accountLastName, accountEmail, accountRole) VALUES (?, ?, ?, ?, ?)', [username.toLowerCase(), firstName, lastName, email.toLowerCase(), role]);
      if (verificationStatus[0].affectedRows > 1){
        return sg.sendAdminVerification(verificationStatus[0][0].accountEmail, verificationStatus[0][0].accountFirstName, verificationStatus[0][0].accountLastName, username);
      }
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!' });
  }
});

//Retrieve Unverified Accounts
router.post('/adminTool/UnverifiedInfo', async (req, res) => {
  const username = req.body.AccountUsername.AccountUsername;

  try  {
    const foundAdminAccount = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

    if (typeof foundAdminAccount[0][0] !== undefined){
      return res.json({ foundAdminAccount: true });
    }
    return res.json({ foundAdminAccount: false });
  }
  catch (err){
    return res.json({ message: 'An Error Occured!' });
  }
});

router.post('/adminTool/Verification', async (req, res) => {
  const password = req.body.password;
  const username = req.body.AccountUsername.AccountUsername;

  bcrypt.hash(password, saltRounds, async function(err, hash) {
    if (err) {
      return res.json({ message: 'An Error Occured!' });
    }
    else {
      try {
        const locateAdminUser = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

        if (typeof locateAdminUser[0][0] !== 'undefined') {
          const verificationStatus = await db.query('INSERT INTO adminusers (accountUsername, accountFirstName, accountLastName, accountEmail, accountPassword, accountRole) VALUES (?, ?, ?, ?, ?, ?)', [locateAdminUser[0][0].accountUsername, locateAdminUser[0][0].accountFirstName, locateAdminUser[0][0].accountLastName, locateAdminUser[0][0].accountEmail, hash, locateAdminUser[0][0].accountRole]);

          if (verificationStatus[0].affectedRows > 1){
            const deleteStatus = await db.query('Delete FROM adminusersverification WHERE accountUsername = ?', [username]);
            
            if (deleteStatus[0].affectedRows > 1) {
              return res.json({VerificationStatus: "Successful"});
            }
            return res.json({VerificationStatus: "Unsuccessful"});
          }
        }
        else {
          return res.json({ message: 'Account either does not exist or is already verified!'})
        }
      }
      catch (err) {
        return res.json({ message: 'An Error Occured!' });
      }
    }
  });
});

//Logged in account role
router.post('/loggedIn_adminAccountLevel', async (req, res) => {

  try {
    const locateAdminUser = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);

    if (typeof locateAdminUser[0][0] !== undefined) {
      if (locateAdminUser[0][0].accountRole == "Root" || locateAdminUser[0][0].accountRole == "Admin"){
        return res.json({ isAdmin: true});
      }
    }
    return res.json({ isAdmin: false});
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!'});
  }
});
//----------------------------------------- VERIFICATION TABLE SETUP ---------------------------------------------------
//Retrieve Verified Accounts
router.post('/account_retrieval', async (req, res) => {

  try {
    const locateAllAdmins = await db.query('SELECT * FROM adminusers');

    if (typeof locateAllAdmins !== 'undefined') {
      return res.send(locateAllAdmins);
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!'});
  }
});

//Retrieve Unverified Accounts
router.post('/account_unverifiedRetrieval', async (req, res) => {
  try {
    const unverifiedAdmin = await  db.query('SELECT * FROM adminusersverification');

    if (typeof unverifiedAdmin !== 'undefined') {
      return res.send(unverifiedAdmin);
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!'});
  }
});
//----------------------------------------- PROFILE SETUP ---------------------------------------------------
router.post('/adminAccountDetail_retrieval', async (req, res) => {
  const username = req.body.SelectedAdmin.SelectedAdmin;

  try {
    const locateAdminUser = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locateUnverifiedAdmin = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

    if (typeof locateAdminUser[0][0] !== 'undefined') {
      return res.send(locateAdminUser[0][0]);
    }
    else if (typeof locateUnverifiedAdmin[0][0] !== 'undefined') {
      return res.send(locateUnverifiedAdmin[0][0]);
    }
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminAccountDetail_Update', async (req, res) => {
  const username = req.session.user;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const role = req.body.selectRole;

  try {
    const locateAdminUser = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locateUnverifiedAdmin = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

    if (typeof locateAdminUser[0][0] !== 'undefined') {
      const updateStatus = await db.query('UPDATE adminusers SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountRole = ? WHERE accountUsername = ?', [firstName, lastName, email, role, username]);
      if (updateStatus[0].affectedRows > 0) {
        return res.json({updateStatus: "Successful"});
      }
      return res.json({updateStatus: "unSuccessful"});
    }
    else if (typeof locateUnverifiedAdmin[0][0] !== 'undefined') {
      const updateStatus = await db.query('UPDATE adminusersverification SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountRole = ? WHERE accountUsername = ?', [firstName, lastName, email, role, username]);
      if (updateStatus[0].affectedRows > 0) {
        return res.json({updateStatus: "Successful"});
      }
      return res.json({updateStatus: "unSuccessful"});
    }
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }

});

router.post('/adminAccountDetail_Delete', async (req, res) => {
  const username = req.body.username;

  console.log(username)

  try {
    const locateAdminUser = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locateUnverifiedAdmin = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);
    
    if (typeof locateAdminUser[0][0] !== 'undefined') {
      const deleteStatus = await db.query('Delete FROM adminusers WHERE accountUsername = ?', [username]);
      if (deleteStatus[0].affectedRows > 0) {
        return res.json({deleteStatus: "Successful"});
      }
      return res.json({deleteStatus: "unSuccessful"});
    }
    else if (typeof locateUnverifiedAdmin[0][0] !== 'undefined') {
      const deleteStatus = db.query('Delete FROM adminusersverification WHERE accountUsername = ?', [username]);
      if (deleteStatus[0].affectedRows > 0) {
        return res.json({deleteStatus: "Successful"});
      }
      return res.json({deleteStatus: "unSuccessful"});
    }
  } catch (error) {
    console.log(error)
    return res.json({ message: 'An Error Occured!'});
  }
});
//----------------------------------------- TRIVIA SETUP ---------------------------------------------------
router.post('/adminTool/TriviaUpload', async (req, res) => {
  const question = req.body.question;
  const answer = req.body.answer;
  const qaType = req.body.selectQAType;
  const difficulty = req.body.selectDifficulty;

  try {
    const checkDuplicateQA = await db.query('SELECT * FROM questionandanswer WHERE triviaquestions = ?', [question]);

    if (typeof checkDuplicateQA[0][0] !== 'undefined'){
      return res.json({ message: 'Question Already Exists!'});
    }
    else {
      const uploadStatus = await db.query('INSERT INTO questionandanswer (triviaquestions, triviaanswers, triviatype, trivialevel) VALUES (?, ?, ?, ?)', [question, answer, qaType, difficulty]);
      return res.send(uploadStatus);
    }
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaRetrieval', async (req, res) => {

  try {
    const triviaQA = await db.query('SELECT * FROM questionandanswer');
    if (typeof triviaQA !== 'undefined'){
      return res.send(triviaQA)
    }    
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaDetailRetrieval', async (req, res) => {
  const questionID = parseInt(req.body.QuestionID.QuestionID);

  try {
    const trivaQADetail = await db.query('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID]);

    if (typeof trivaQADetail[0][0] !== 'undefined'){
      return res.send(trivaQADetail[0][0]);
    }
    
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaUpdate', async (req, res) => {
  const questionID = req.body.questionID;
  const question = req.body.question;
  const answer = req.body.answer;
  const qaType = req.body.selectQAType;
  const difficulty = req.body.selectDifficulty;

  try {
    const checkDuplicateQA = await db.query('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID]);

    if (typeof checkDuplicateQA[0][0] !== 'undefined'){
      const updateStatus = await db.query('UPDATE questionandanswer SET triviaquestions = ?, triviaanswers = ?, triviatype = ?, trivialevel = ? WHERE triviaID = ?', [question, answer, qaType, difficulty, questionID]);
      
      if (updateStatus[0].affectedRows > 0) {
        return res.json({ updateStatus: 'Successful'});
      }
      return res.json({ updateStatus: 'Unsuccessful'});
    }
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaDelete', async (req, res) => {
  const questionID = req.body.questionID;

  try {
    const triviaQA = await db.query('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID]);

    if (typeof triviaQA[0][0] !== 'undefined') {
      const deleteStatus = await db.query('DELETE FROM questionandanswer WHERE triviaID = ?', [questionID]);
      
      if (deleteStatus[0].affectedRows > 0) {
        return res.json({ deleteStatus: 'Successful'});
      }
      return res.json({ deleteStatus: 'Unsuccessful'});
    }
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});
module.exports = router;