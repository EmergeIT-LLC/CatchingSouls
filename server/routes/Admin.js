const express = require('express');
const router = express.Router();
const adminQueries = require('../config/database/storedProcedures/adminStoredProcedures');
const triviaQueries = require('../config/database/storedProcedures/triviaStoredProcedures');
const emailHandler = require('../config/email/emailTemplate');
const cookieMonster = require('../config/cookies/cookieHandler');
const AWS_S3_Bucket_Handler = require('../config/aws/s3Handler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jsonHandler = require('../functions/jsonHandler');
//----------------------------------------- BEGINNING OF PASSPORT MIDDLEWARE AND SETUP ---------------------------------------------------
// function requireAuth(req, res, next) {
//   if (req.session.user) {
//     next(); // User is authenticated, proceed to the route
//   } else {
//     res.json({ message: 'Unauthorized' });
//   }
// }
// // Example usage to protect a route
// router.get('/adminprotected', requireAuth, (req, res) => {
//   res.json({ message: 'This is a protected route' });
// });
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
      return res.json({ registerStatus: "Unsuccessful", message: 'Email already registered!' });
    }
    else if (locateAdminUser){
      return res.json({ registerStatus: "Unsuccessful", message: 'User already registered!' });
    }
    else if (locatedUnverifiedAdmin.length > 0){
      emailHandler.sendAdminVerification(locatedUnverifiedAdmin[0].accountEmail, locatedUnverifiedAdmin[0].accountFirstName, locatedUnverifiedAdmin[0].accountLastName, username.toLowerCase());
      return res.json({ registerStatus: "Unsuccessful", message: 'User needs to check email to verify account'});
    }
    else {
      const isAdded = await adminQueries.addAdmin(username.toLowerCase(), firstName, lastName, email.toLowerCase(), role);
      console.log(isAdded);
      if (isAdded){
        emailHandler.sendAdminVerification(email.toLowerCase(), firstName, lastName, username.toLowerCase());
        return res.json({registerStatus: "Successful"});
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
            const isVerificationDeletionSuccessful = await adminQueries.removeUnverifiedAdminUsername(username.toLowerCase());
            
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
    const locateAdminUser = await adminQueries.verifiedAdminCheckUsername(username.toLowerCase());

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
    return res.send([]);
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
    return res.send([]);
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!'});
  }
});
//----------------------------------------- PROFILE SETUP ---------------------------------------------------
router.post('/adminAccountDetail_retrieval', async (req, res) => {
  const username = req.body.SelectedAdmin.SelectedAdmin;

  try {
    const locateAdminUser = await adminQueries.locateVerifiedAdminData(username.toLowerCase());
    const locateUnverifiedAdmin = await adminQueries.locateUnverifiedAdminData(username.toLowerCase());

    if (locateAdminUser.length > 0) {
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());

      return res.json({user: locateAdminUser[0], cookieSetting: cookieSettings});
    }
    else if (locateUnverifiedAdmin.length > 0) {
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());

      return res.send({user: locateUnverifiedAdmin[0], cookieSetting: cookieSettings});
    }
    return res.json({ message: 'User Not Found!', data:[]});
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
    const locateAdminUser = await adminQueries.verifiedAdminCheckUsername(username.toLowerCase());
    const locateUnverifiedAdmin = await adminQueries.unverifiedAdminCheckUsername(username.toLowerCase());

    if (locateAdminUser) {
      const updateStatus = await adminQueries.updateVerifiedAdminAccount(firstName, lastName, email, role, username.toLowerCase());
      if (updateStatus) {
        let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());

        return res.json({updateStatus: "Successful", cookieSetting: cookieSettings});
      }
      return res.json({updateStatus: "Unsuccessful"});
    }
    else if (locateUnverifiedAdmin) {
      const updateStatus = await adminQueries.updateUnverifiedAdminAccount(firstName, lastName, email, role, username.toLowerCase());
      if (updateStatus) {
        let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());

        return res.json({updateStatus: "Successful", cookieSetting: cookieSettings});
      }
      return res.json({updateStatus: "Unsuccessful"});
    }
    return res.json({ message: 'User Not Found!', data:[]});
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }

});

router.post('/adminAccountDetail_Delete', async (req, res) => {
  const username = req.body.username;

  try {
    const locateAdminUser = await adminQueries.verifiedAdminCheckUsername(username.toLowerCase());
    const locateUnverifiedAdmin = await adminQueries.unverifiedAdminCheckUsername(username.toLowerCase());
    
    if (locateAdminUser) {
      const deleteStatus = await adminQueries.removeVerifiedAdminUsername(username.toLowerCase());
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());

      if (deleteStatus) {
        return res.json({deleteStatus: "Successful", cookieSetting: cookieSettings});
      }
      return res.json({deleteStatus: "Unsuccessful", cookieSetting: cookieSettings});
    }
    else if (locateUnverifiedAdmin) {
      const deleteStatus = await adminQueries.removeUnverifiedAdminUsername(username.toLowerCase());
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());

      if (deleteStatus) {
        return res.json({deleteStatus: "Successful", cookieSetting: cookieSettings});
      }
      return res.json({deleteStatus: "Unsuccessful", cookieSetting: cookieSettings});
    }
  } catch (error) {
    console.log(error)
    return res.json({ message: 'An Error Occured!'});
  }
});
//----------------------------------------- DATABASE SETUP -------------------------------------------------
router.post('/adminTool/DatabaseBackup', async (req, res) => {
  try {
    AWS_S3_Bucket_Handler.backupDatabaseToS3();
    return res.json({ executionStatus: "Successful", message: 'Database backup has begun...'});
  }
  catch (error) {
    return res.json({ executionStatus: "Unsuccessful", message: 'An Error Occured!'});
  }
});
router.post('/adminTool/DatabaseImport', async (req, res) => {
  try {
    AWS_S3_Bucket_Handler.importBackupFromS3();
    return res.json({ executionStatus: "Successful", message: 'Database import has begun...'});
  }
  catch (error) {
    return res.json({ executionStatus: "Unsuccessful", message: 'An Error Occured!'});
  }
});
router.post('/adminTool/BackupImportInfo', async (req, res) => {
  try {
    const backupImportData = await jsonHandler.getBackupImportInfo();
    res.json({BackupImportInfo: backupImportData})
  }
  catch (error) {
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
  const verse = req.body.verse;

  try {
    const checkDuplicateQA = await triviaQueries.qaCheckQuestion(question);

    if (checkDuplicateQA){
      return res.json({ message: 'Question Already Exists!'});
    }
    else {
      const uploadStatus = await triviaQueries.addQA(question, answer, qaType, difficulty, verse);
      if (uploadStatus)
        return res.json({uploadStatus: "Successful"});
      }
      return res.json({uploadStatus: "Unsuccessful"});
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaRetrieval', async (req, res) => {

  try {
    const triviaQA = await triviaQueries.qaGetAllQuestionData();
    if (triviaQA.length > 0){
      return res.send(triviaQA)
    }
    return res.send([]);
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaDetailRetrieval', async (req, res) => {
  const questionID = parseInt(req.body.QuestionID.QuestionID);

  try {
    const trivaQADetail = await triviaQueries.qaGetQuestionDataId(questionID);

    if (trivaQADetail.length > 0){
      return res.send(trivaQADetail);
    }
    return res.send([]);
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
  const verse = req.body.supportingVerse;

  try {
    const foundQA = await triviaQueries.qaCheckQuestionID(questionID);

    if (foundQA){
      const updateStatus = await triviaQueries.updateQAQuestionID(questionID, question, answer, qaType, difficulty, verse);
      
      if (updateStatus) {
        return res.json({ updateStatus: 'Successful'});
      }
      return res.json({ updateStatus: 'Unsuccessful'});
    }
    return res.send([]);
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});

router.post('/adminTool/TriviaDelete', async (req, res) => {
  const questionID = req.body.questionID;

  try {
    const triviaQA = await triviaQueries.qaCheckQuestionID(questionID);

    if (triviaQA) {
      const deleteStatus = await triviaQA.removeQAQuestionID(questionID);
      
      if (deleteStatus) {
        return res.json({ deleteStatus: 'Successful'});
      }
      return res.json({ deleteStatus: 'Unsuccessful'});
    }
  } catch (error) {
    return res.json({ message: 'An Error Occured!'});
  }
});
module.exports = router;