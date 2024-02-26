const express = require('express');
const router = express.Router();
//const db = require('../config/database/dbConnection');
const adminQueries = require('../config/database/storedProcedures/adminStoredProcedures');
const emailHandler = require('../config/email/emailTemplate');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
//----------------------------------------- BEGINNING OF PASSPORT MIDDLEWARE AND SETUP ---------------------------------------------------
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
    const locateAdminEmail = await adminQueries.verifiedAdminCheckEmail(email.toLowerCase());
    const locateAdminUser = await adminQueries.verifiedAdminCheckUsername(username.toLowerCase());
    const locatedUnverifiedAdmin = await adminQueries.locateUnverifiedAdminData(username.toLowerCase());

    if (locateAdminEmail){
      return res.json({ message: 'Email already registered!' });
    }
    else if (locateAdminUser){
      return res.json({ message: 'User already registered!' });
    }
    else if (locatedUnverifiedAdmin.length > 0){
      emailHandler.sendAdminVerification(locatedUnverifiedAdmin[0].accountEmail, locatedUnverifiedAdmin[0].accountFirstName, locatedUnverifiedAdmin[0].accountLastName, username.toLowerCase());
      return res.json({ message: 'User needs to check email to verify account'});
    }
    else {
      const isAdded = await adminQueries.addAdmin(username.toLowerCase(), firstName, lastName, email.toLowerCase(), role);
      if (isAdded){
        return emailHandler.sendAdminVerification(email.toLowerCase(), firstName, lastName, username.toLowerCase());
      }
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});

//Retrieve Unverified Accounts
router.post('/adminTool/UnverifiedInfo', async (req, res) => {
  const username = req.body.AccountUsername.AccountUsername;

  try  {
    const foundAdminAccount = await adminQueries.unverifiedAdminCheckUsername(username.toLowerCase());

    if (foundAdminAccount){
      return res.json({ foundAdminAccount: true });
    }
    return res.json({ foundAdminAccount: false });
  }
  catch (err){
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});

router.post('/adminTool/Verification', async (req, res) => {
  const password = req.body.password;
  const username = req.body.AccountUsername.AccountUsername;

  bcrypt.hash(password, saltRounds, async function(err, hash) {
    if (err) {
      return res.json({ message: 'An Error Occured!', errorMessage: err.message });
    }
    else {
      try {
        const unverifiedAdminData = await await adminQueries.locateUnverifiedAdminData(username.toLowerCase());

        if (unverifiedAdminData.length > 0) {
          const isVerificationMoveSuccessful = await adminQueries.moveAdmin(unverifiedAdminData[0].accountUsername, unverifiedAdminData[0].accountFirstName, unverifiedAdminData[0].accountLastName, unverifiedAdminData[0].accountEmail, hash, unverifiedAdminData[0].accountRole);

          if (isVerificationMoveSuccessful){
            const isVerificationDeletionSuccessful = await adminQueries.removeUnverifiedAdminUsername(username);
            
            if (isVerificationDeletionSuccessful) {
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
        return res.json({ message: 'An Error Occured!', errorMessage: err.message });
      }
    }
  });
});

//Logged in account role
router.post('/loggedIn_adminAccountLevel', async (req, res) => {

  try {
    const locateAdminUser = await adminQueries.verifiedAdminCheckUsername(username);

    if (locateAdminUser.length > 0) {
      if (locateAdminUser[0].accountRole == "Root" || locateAdminUser[0].accountRole == "Admin"){
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
    const locateAllAdmins = await adminQueries.locateAllAdmins();

    if (locateAllAdmins.length > 0) {
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
    const unverifiedAdmin = await adminQueries.locateAllUnverifiedAdmins();

    if (unverifiedAdmin.length > 0) {
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
    const locateAdminUser = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locateUnverifiedAdmin = await db.all('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

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
    const locateAdminUser = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locateUnverifiedAdmin = await db.all('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

    if (typeof locateAdminUser[0][0] !== 'undefined') {
      const updateStatus = await db.all('UPDATE adminusers SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountRole = ? WHERE accountUsername = ?', [firstName, lastName, email, role, username]);
      if (updateStatus[0].affectedRows > 0) {
        return res.json({updateStatus: "Successful"});
      }
      return res.json({updateStatus: "unSuccessful"});
    }
    else if (typeof locateUnverifiedAdmin[0][0] !== 'undefined') {
      const updateStatus = await db.all('UPDATE adminusersverification SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountRole = ? WHERE accountUsername = ?', [firstName, lastName, email, role, username]);
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
    const locateAdminUser = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locateUnverifiedAdmin = await db.all('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);
    
    if (typeof locateAdminUser[0][0] !== 'undefined') {
      const deleteStatus = await db.all('Delete FROM adminusers WHERE accountUsername = ?', [username]);
      if (deleteStatus[0].affectedRows > 0) {
        return res.json({deleteStatus: "Successful"});
      }
      return res.json({deleteStatus: "unSuccessful"});
    }
    else if (typeof locateUnverifiedAdmin[0][0] !== 'undefined') {
      const deleteStatus = db.all('Delete FROM adminusersverification WHERE accountUsername = ?', [username]);
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
    const checkDuplicateQA = await db.all('SELECT * FROM questionandanswer WHERE triviaquestions = ?', [question]);

    if (typeof checkDuplicateQA[0][0] !== 'undefined'){
      return res.json({ message: 'Question Already Exists!'});
    }
    else {
      const uploadStatus = await db.all('INSERT INTO questionandanswer (triviaquestions, triviaanswers, triviatype, trivialevel) VALUES (?, ?, ?, ?)', [question, answer, qaType, difficulty]);
      return res.send(uploadStatus);
    }
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaRetrieval', async (req, res) => {

  try {
    const triviaQA = await db.all('SELECT * FROM questionandanswer');
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
    const trivaQADetail = await db.all('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID]);

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
    const checkDuplicateQA = await db.all('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID]);

    if (typeof checkDuplicateQA[0][0] !== 'undefined'){
      const updateStatus = await db.all('UPDATE questionandanswer SET triviaquestions = ?, triviaanswers = ?, triviatype = ?, trivialevel = ? WHERE triviaID = ?', [question, answer, qaType, difficulty, questionID]);
      
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
    const triviaQA = await db.all('SELECT * FROM questionandanswer WHERE triviaID = ?', [questionID]);

    if (typeof triviaQA[0][0] !== 'undefined') {
      const deleteStatus = await db.all('DELETE FROM questionandanswer WHERE triviaID = ?', [questionID]);
      
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