require('dotenv').config();
const express = require('express');
const router = express.Router();
const userQueries = require('../config/database/storedProcedures/userStoredProcedures');
const adminQueries = require('../config/database/storedProcedures/adminStoredProcedures');
const emailHandler = require('../config/email/emailTemplate');
const cookieMonster = require('../config/cookies/cookieHandler');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
//----------------------------------------- REGISTER AND VERIFICATION SETUP ---------------------------------------------------
//Register page communication
router.post('/register', async (req, res) => {
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const churchName = req.body.churchName;
  const denomination = req.body.denomination;
  const churchLocation = req.body.churchLocation;

  try {
    const isDuplicateVerifiedUser = await userQueries.verifiedUserCheckEmail(email);
    const isDuplicateUnverifiedUser = await userQueries.unverifiedUserCheckEmail(email);
    
    if (isDuplicateVerifiedUser) {
      return res.json({ message: 'User already registered!' })
    }
    else if (isDuplicateUnverifiedUser) {
      emailHandler.sendVerification(email, firstName, lastName, username.toLowerCase());
      return res.json({ message: 'User needs to check email to verify account'});
    }
    else {
      bcrypt.hash(password, saltRounds, async function(err, hash) {
        try {
          //Add user to verification table
          const isUserAdded = await userQueries.addUser(username.toLowerCase(), firstName, lastName, email, hash, churchName, denomination, churchLocation)

          if (isUserAdded) {
            emailHandler.sendVerification(email, firstName, lastName, username.toLowerCase());
            return res.json({registerStatus: "Successful"});
          }
          else {
            return res.json({registerStatus: "Unsuccessful", message: 'An error occured while adding user'})
          }
        }
        catch (err){
          return res.json({ message: 'An Error Occured While Setting Credentials!' });
        }
      });
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});

//Locate User on Verification Table
router.post('/verificationInfo', async (req, res) => {
  const username = req.body.AccountUsername.AccountUsername;

  try {
    const isUnverifiedUserFound = await userQueries.unverifiedUserCheckUsername(username.toLowerCase());

    if (isUnverifiedUserFound) {
      return res.json({foundAccount: true});
    }
    else {
      return res.json({foundAccount: false});
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});

//Move user from verification table to accounts table
router.post('/verifyUser', async (req, res) => {
  const username = req.body.AccountUsername.AccountUsername;
  
  try {
    const unverifiedUser = await userQueries.locateUnverifiedUserData(username.toLowerCase());

    if (unverifiedUser.length > 0){
      const isVerificationMoveSuccessful = await userQueries.moveUser(username.toLowerCase(), unverifiedUser[0].accountFirstName, unverifiedUser[0].accountLasstName, unverifiedUser[0].accountEmail, unverifiedUser[0].accountPassword, unverifiedUser[0].churchName, unverifiedUser[0].denomination, unverifiedUser[0].churchLocation);


      if (isVerificationMoveSuccessful) {
        const isVerificationDeletionSuccessful = await userQueries.removeUnverifiedUserUsername(username.toLowerCase());
        
        if (isVerificationDeletionSuccessful) {
          return res.json({Verified: true});
        }
        else {
          return res.json({Verified: false, message: "An error occured while removing users info from verification state"});
        }  
      }
      else {
        return res.json({Verified: false, message: "An error occured while moving users info"});
      }
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  } 
});
//----------------------------------------- LOGIN SETUP ---------------------------------------------------
//Login Page
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  try {
    const userVerification = await userQueries.unverifiedUserCheckUsername(username.toLowerCase());
    const userLogin = await userQueries.locateVerifiedUserData(username.toLowerCase());
    const adminVerification = await adminQueries.unverifiedAdminCheckUsername(username.toLowerCase());
    const adminLogin = await adminQueries.locateVerifiedAdminData(username.toLowerCase());

    // Check User Verification
    if (userVerification) {
      const unverifiedUser = await userQueries.locateUnverifiedUserData(username.toLowerCase());
      emailHandler.sendVerification(unverifiedUser[0].accountEmail, unverifiedUser[0].accountFirstName, unverifiedUser[0].accountLastName, username.toLowerCase());
      res.json({ message: 'User needs to check email to verify account' });
    }
    // Check User Table
    else if (userLogin.length > 0) {
      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, userLogin[0].accountPassword, (err, result) => {
          if (err){
            reject(err);
          }
          else {
            resolve(result);
          }
        });
      });

      if (result === true) {
        let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
        return res.json({ loggedIn: true, username: username.toLowerCase(), cookieSetting: cookieSettings});
      }
      else {
        return res.json({ loggedIn: false, message: 'Account Does Not Exist or Password Is Incorrect!' });
      }
    }
    // Check Admin Verification
    else if (adminVerification) {
      const unverifiedAdmin = await adminQueries.locateUnverifiedAdminData(username.toLowerCase());
      emailHandler.sendAdminVerification(unverifiedAdmin[0].accountEmail, unverifiedAdmin[0].accountFirstName, unverifiedAdmin[0].accountLastName, username.toLowerCase());
      res.json({ message: 'User needs to check email to verify account' });
    }
    // Check Admin Table
    else if (adminLogin.length > 0) {
      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, adminLogin[0].accountPassword, (err, result) => {
          if (err){
            reject(err);
          }
          else {
            resolve(result);
          }
        });
      });

      if (result === true) {
        let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
        return res.json({ loggedIn: true, username: username.toLowerCase(), isAdmin: true, cookieSetting: cookieSettings });
      }
      else {
        return res.json({ loggedIn: false, message: 'Account Does Not Exist or Password Is Incorrect!' });
      }
    } else {
      return res.json({ loggedIn: false, message: 'Account Does Not Exist or Password Is Incorrect!' });
    }
  } catch (err) {
    console.log(err);
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});
router.post('/logout', async (req, res) => {
  const username = req.body.username;
  let cookieSettings = await cookieMonster.deleteCookie(res, 'csAuthServices-' + username.toLowerCase())
  return res.json({ loggedIn: false, message: 'Logged out', cookieSetting: cookieSettings });
});
//----------------------------------------- PROFILE SETUP ---------------------------------------------------
//Get Account Profile Information
router.post('/accountDetail_retrieval', async (req, res) => {
  const username = req.body.username;

  try {
    const locateUser = await userQueries.locateVerifiedUserData(username.toLowerCase());
    const locateUnverifiedUser = await userQueries.locateUnverifiedUserData(username.toLowerCase());
    const locateAdmin = await adminQueries.locateVerifiedAdminData(username.toLowerCase());
    const locateUnverifiedAdmin = await adminQueries.locateUnverifiedAdminData(username.toLowerCase());

    if (locateUser.length > 0){
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
      return res.json({user: locateUser[0], cookieSetting: cookieSettings});
    }
    else if (locateUnverifiedUser.length > 0){
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
      return res.json({user: locateUnverifiedUser[0], cookieSetting: cookieSettings});
    }
    else if (locateAdmin.length > 0){
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
      return res.json({user: locateAdmin[0], cookieSetting: cookieSettings});
    }
    else if (locateUnverifiedAdmin.length > 0){
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
      return res.json({user: locateUnverifiedAdmin[0], cookieSetting: cookieSettings});
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});

//Update Account
router.post('/account_Update', async (req, res) => {
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const currentPassword = req.body.password;
  const newPassword = req.body.newPassword;
  const churchName = req.body.churchName;
  const denomination = req.body.denomination;
  const churchLocation = req.body.churchLocation;

  try {
    isUser = await userQueries.locateVerifiedUserData(username.toLowerCase());
    isAdmin = await adminQueries.locateVerifiedAdminData(username.toLowerCase());

    if (isUser.length > 0) {
      if (currentPassword != null) {
        bcrypt.compare(currentPassword, isUser[0].accountPassword, async (err, result) => {
          if (result == true) {
            bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
              if (err) {
                return res.json({ message: 'An Error Occured!', errorMessage: err.message });
              }
              else {
                const userUpdateStatus = await userQueries.updateUserAccountWithPW(username.toLowerCase(), firstName, lastName, email, hash, churchName, denomination, churchLocation);
                if (userUpdateStatus){
                  let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
                  return res.json({ updateStatus: 'Successful', cookieSetting: cookieSettings});
                }
                return res.json({ updateStatus: 'Unsuccessful'});
              }
            });
          }
          else {
            return res.json({ message: 'Current Password Is Incorrect!' });
          }
        });
      }
      else {
        const userUpdateStatus = await userQueries.updateUserAccountWithoutPW(username.toLowerCase(), firstName, lastName, email, churchName, denomination, churchLocation);
        if (userUpdateStatus){
          let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
          return res.json({ updateStatus: 'Successful', cookieSetting: cookieSettings});
        }
        return res.json({ updateStatus: 'Unsuccessful'});
      }
    }
    else if (isAdmin.length > 0) {
      if (currentPassword != null) {
        bcrypt.compare(currentPassword, isAdmin[0].accountPassword, async (err, result) => {
          if (result == true) {
            bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
              if (err) {
                return res.json({ message: 'An Error Occured!', errorMessage: err.message });
              }
              else {          
                const adminUpdateStatus = await adminQueries.updateAdminAccountWithPW(username.toLowerCase(), firstName, lastName, email, hash, churchName, denomination, churchLocation);
                if (adminUpdateStatus){
                  let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
                  return res.json({ updateStatus: 'Successful', cookieSetting: cookieSettings});
                }
                return res.json({ updateStatus: 'Unsuccessful'});
              }
            });
          }
          else {
            return res.json({ message: 'Current Password Is Incorrect!' });
          }
        });
      }
      else {
        const adminUpdateStatus = await adminQueries.updateAdminAccountWithoutPW(username.toLowerCase(), firstName, lastName, email);
        if (adminUpdateStatus){
          let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
          return res.json({ updateStatus: 'Successful', cookieSetting: cookieSettings});
        }
        return res.json({ updateStatus: 'Unsuccessful'});
      }
    }
  }
  catch(err) {
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});

//Delete Account
router.post('/account_Delete', async (req, res) => {
  const username = req.body.username;

  try {
    const deleteStatus = await userQueries.removeVerifiedUserUsername(username.toLowerCase());
    if (deleteStatus){
      let cookieSettings = await cookieMonster.setCookie(res, 'csAuthServices-' + username.toLowerCase(), username.toLowerCase());
      return res.json({ deleteStatus: 'Successful', cookieSetting: cookieSettings});
    }
    return res.json({ deleteStatus: 'Unsuccessful'});
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!', errorMessage: err.message });
  }
});
//----------------------------------------- RECOVERY SETUP ---------------------------------------------------
//Recover page communication
router.post('/account_Recovery', async (req, res) => {
  let firstName;
  let lastName;
  let email;
  const username = req.body.username;

  try {
    const locateUser = await userQueries.locateVerifiedUserData(username.toLowerCase());
    const locateAdmin = await adminQueries.locateVerifiedAdminData(username.toLowerCase());

    if (locateUser.length > 0){
      const checkDuplicateRecovery = userQueries.locateRecoveryUserData(username.toLowerCase());

      if (checkDuplicateRecovery) {
        return emailHandler.sendVerification(locateUser[0].accountEmail, locateUser[0].accountFirstName, locateUser[0].accountLastName, username.toLowerCase());
      }
      else {
        const addToReovery = await userQueries.insertIntoUserRecovery(username.toLowerCase());
      
        if (addToReovery) {
          return emailHandler.sendVerification(locateUser[0].accountEmail, locateUser[0].accountFirstName, locateUser[0].accountLastName, username.toLowerCase());
        }  
      }
    }
    else if (locateAdmin.length > 0) {
      const checkDuplicateRecovery = userQueries.locateRecoveryUserData(username.toLowerCase());

      if (checkDuplicateRecovery) {
        return emailHandler.sendVerification(locateAdmin[0].accountEmail, locateAdmin[0].accountFirstName, locateAdmin[0].accountLastName, username.toLowerCase());
      }
      else {
        const addToReovery = await userQueries.insertIntoUserRecovery(username.toLowerCase());

        if (addToReovery) {
          return emailHandler.sendVerification(locateAdmin[0].accountEmail, locateAdmin[0].accountFirstName, locateAdmin[0].accountLastName, username.toLowerCase());
        }
      }
    }
    else {
      return res.json({ message: 'User does not exist!' });  
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occurred!' });
  }
});

router.post('/locateUnrecovered', async (req, res) => {
  const username = req.body.AccountUsername.AccountUsername;

  try {
    const foundUser = await userQueries.locateUserInRecovery(username.toLowerCase());
    const foundAdmin = await adminQueries.locateAdminInRecovery(username.toLowerCase());

    if (foundUser){
      return res.json({ foundAccount: true });
    }
    else if (foundAdmin){
      return res.json({ foundAccount: true });
    }
    return res.json({ foundAccount: false });
  }
  catch (err) {
    return res.json({ message: 'An Error Occurred!' });
  }
});

router.post('/recoveryverification', async (req, res) => {
  const password = req.body.password;
  const username = req.body.AccountUsername.AccountUsername;

  try {
    const locateUser = await userQueries.locateVerifiedUserData(username.toLowerCase());
    const locateAdmin = await adminQueries.locateVerifiedAdminData(username.toLowerCase());

    if(locateUser.length > 0){
      if (password != null){
        bcrypt.hash(password, saltRounds, async function(err, hash) {
          const updateStatus = await userQueries.recoverAccountInRecoverPW(hash, username.toLowerCase());
            
          if (updateStatus) {
            const deleteStatus = await userQueries.removeUserFromRecovery(username.toLowerCase());
            if (deleteStatus) {
              return res.json({recoveryStatus: "Successful"});
            }
            return res.json({recoveryStatus: "Unsuccessful"})
          }
        });       
      }
    }
    else if (locateAdmin.length > 0){
      if (password != null){
        bcrypt.hash(password, saltRounds, async function(err, hash) {
          const updateStatus = await adminQueries.recoverAccountInRecoverPW(hash, username.toLowerCase());
            
          if (updateStatus) {
            const deleteStatus = await adminQueries.removeAdminFromRecovery(username.toLowerCase());
            if (deleteStatus) {
              return res.json({recoveryStatus: "Successful"});
            }
            return res.json({recoveryStatus: "Unsuccessful"})
          }
        });       
      }
    }
    else {
      return res.json({ message: 'Account is not in recovery mode' });
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occurred!' });
  }
});

router.post('/sendUsYourQuestions', async (req, res) => {
  const sendersFirstName = req.body.firstName;
  const sendersLastName = req.body.lastName;
  const sendersEmail = req.body.email;
  const sendersTriviaQ = req.body.question;
  const sendersTriviaA = req.body.answer;
  const sendersTriviaS = req.body.verse;

  const noticeSentToAdmin = emailHandler.sendUsersQuestionAnswerNotice(sendersFirstName, sendersLastName, sendersTriviaQ, sendersTriviaA, sendersTriviaS);
  const noticeSentToClient = emailHandler.sendUsersQuestionAnswerRecievedNotice(sendersEmail, sendersFirstName, sendersLastName)

  if (noticeSentToAdmin && noticeSentToClient) {
    return res.json({successStatus: "Successful"});
  }
  return res.json({successStatus: "Unsuccessful"});
});

module.exports = router;