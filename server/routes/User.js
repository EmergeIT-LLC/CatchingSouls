require('dotenv').config();
const express = require('express');
const router = express.Router();
// const db = require('../config/database/dbConnection');
const queries = require('../config/database/storedProcedures');
const emailHandler = require('../config/email/emailTemplate');
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

  try {
    const isDuplicateVerifiedUser = await queries.verifiedUserCheck(email);
    const isDuplicateUnverifiedUser = await queries.unverifiedUserCheck(email);
    
    if (isDuplicateVerifiedUser) {
      return res.json({ message: 'User already registered!' })
    }
    else if (isDuplicateUnverifiedUser) {
      emailHandler.sendVerification(email, firstName, lastName, username);
      return res.json({ message: 'User needs to check email to verify account'});
    }
    else {
      bcrypt.hash(password, saltRounds, async function(err, hash) {
        try {
          //Add user to verification table
          const isUserAdded = await queries.addUser(username, firstName, lastName, email, hash)

          if (isUserAdded) {
            emailHandler.sendVerification(email, firstName, lastName, username);
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
    const locatedUnverifiedUser = await db.all('SELECT * FROM userverification WHERE accountUsername = ?', [username]);

    if (typeof locatedUnverifiedUser[0][0] !== 'undefined') {
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
    const unverifiedUser = await db.all('SELECT * FROM userverification WHERE accountUsername = ?', [username]);

    if (typeof unverifiedUser[0][0] !== 'undefined'){
      const movingUser = await db.all('INSERT INTO users (accountUsername, accountFirstName, accountLastName, accountEmail, accountPassword) VALUES (?, ?, ?, ?, ?)', [unverifiedUser[0][0].accountUsername, unverifiedUser[0][0].accountFirstName, unverifiedUser[0][0].accountLastName, unverifiedUser[0][0].accountEmail, unverifiedUser[0][0].accountPassword]);
      
      if (movingUser[0].affectedRows > 0) {
        const deletingUser = await db.all('Delete FROM userverification WHERE accountUsername = ?', [username]);
        
        if (deletingUser[0].affectedRows > 0) {
          return res.json({Verified: true});
        }
      }
      return res.json({Verified: false});
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
    const userVerification = await db.all('SELECT * FROM userverification WHERE accountUsername = ?', [username]);
    const userLogin = await db.all('SELECT * FROM users WHERE accountUsername = ?', [username]);
    const adminVerification = await db.all('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);
    const adminLogin = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);

    // Check User Verification
    if (typeof userVerification[0][0] !== 'undefined') {
      emailHandler.sendVerification(userVerification[0][0].accountEmail, userVerification[0][0].accountFirstName, userVerification[0][0].accountLastName, username);
      res.json({ message: 'User needs to check email to verify account' });
    }
    // Check User Table
    else if (typeof userLogin[0][0] !== 'undefined') {
      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, userLogin[0][0].accountPassword, (err, result) => {
          if (err){
            reject(err);
          }
          else {
            resolve(result);
          }
        });
      });

      if (result === true) {
        req.session.username = username;
        req.session.loggedIn = true;
        req.session.isAdmin = false;
        res.cookie('BibleTriviaSessionCookies', req.sessionID);
        res.cookie('username', username);
        res.cookie('loggedIn', true);
        res.cookie('isAdmin', false);
        res.setHeader('Set-Cookie-Instructions', 'loggedIn=true; username=username; isAdmin=false');
        return res.json({ loggedIn: true, username: username });
      }
      else {
        return res.json({ loggedIn: false, message: 'Account Does Not Exist or Password Is Incorrect!' });
      }
    }
    // Check Admin Verification
    else if (typeof adminVerification[0][0] !== 'undefined') {
      emailHandler.sendAdminVerification(adminVerification[0][0].accountEmail, adminVerification[0][0].accountFirstName, adminVerification[0][0].accountLastName, username);
      res.json({ message: 'User needs to check email to verify account' });
    }
    // Check Admin Table
    else if (typeof adminLogin[0][0] !== 'undefined') {
      const result = await new Promise((resolve, reject) => {
        bcrypt.compare(password, adminLogin[0][0].accountPassword, (err, result) => {
          if (err){
            reject(err);
          }
          else {
            resolve(result);
          }
        });
      });

      if (result === true) {
        req.session.username = username;
        req.session.loggedIn = true;
        req.session.isAdmin = true;
        res.cookie('BibleTriviaSessionCookies', req.sessionID);
        res.cookie('username', username);
        res.cookie('loggedIn', true);
        res.cookie('isAdmin', true);
        res.setHeader('Set-Cookie-Instructions', 'loggedIn=true; username=username; isAdmin=true');
        return res.json({ loggedIn: true, username: username, isAdmin: true });
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
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: 'Error logging out' });
    }
    res.clearCookie('BibleTriviaSessionCookies');
    res.json({ loggedIn: false, message: 'Logged out' });
  });
});
//----------------------------------------- PROFILE SETUP ---------------------------------------------------
//Get Account Profile Information
router.post('/accountDetail_retrieval', async (req, res) => {
  const username = req.body.username;

  try {
    await db.all('SELECT * FROM users WHERE accountUsername = ?', [username], (err, row) => {
      if (err) {
        return res.json({ message: 'A Database Error Occured!', errorMessage: err.message });
      }
      return res.send(row);
    });
    // const locateUnverifiedUser = await db.all('SELECT * FROM userverification WHERE accountUsername = ?', [username]);
    // const locateAdmin = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    // const locateUnverifiedAdmin = await db.all('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

    // if (typeof locateUser[0][0] !== 'undefined'){
    //   return res.send(locateUser[0][0]);
    // }
    // else if (typeof locateUnverifiedUser[0][0] !== 'undefined'){
    //   return res.send(locateUnverifiedUser[0][0]);
    // }
    // else if (typeof locateAdmin[0][0] !== 'undefined'){
    //   return res.send(locateAdmin[0][0]);
    // }
    // else if (typeof locateUnverifiedAdmin[0][0] !== 'undefined'){
    //   return res.send(locateUnverifiedAdmin[0][0]);
    // }
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

  try {
    isUser = await db.all('SELECT * FROM users WHERE accountUsername = ?', [username.toLowerCase()]);
    isAdmin = await db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username.toLowerCase()]);

    if (typeof isUser[0][0] !== 'undefined') {
      if (currentPassword != null) {
        bcrypt.compare(currentPassword, isUser[0][0].accountPassword, async (err, result) => {
          if (result == true) {
            bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
              if (err) {
                return res.json({ message: 'An Error Occured!', errorMessage: err.message });
              }
              else {
                const userUpdateStatus = await db.all('UPDATE users SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountPassword = ? WHERE accountUsername = ?', [firstName, lastName, email, hash, username]);
                if (userUpdateStatus[0].affectedRows > 0){
                  return res.json({ updateStatus: 'Successful'});
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
        const userUpdateStatus = await db.all('UPDATE users SET accountFirstName = ?, accountLastName = ?, accountEmail = ? WHERE accountUsername = ?', [firstName, lastName, email, username]);
        if (userUpdateStatus[0].affectedRows > 0){
          return res.json({ updateStatus: 'Successful'});
        }
        return res.json({ updateStatus: 'Unsuccessful'});
      }
    }
    else if (typeof isAdmin[0][0] !== 'undefined') {
      if (currentPassword != null) {
        bcrypt.compare(currentPassword, isAdmin[0][0].accountPassword, async (err, result) => {
          if (result == true) {
            bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
              if (err) {
                return res.json({ message: 'An Error Occured!', errorMessage: err.message });
              }
              else {          
                const adminUpdateStatus = await db.all('UPDATE adminusers SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountPassword = ? WHERE accountUsername = ?', [firstName, lastName, email, hash, username]);
                if (adminUpdateStatus[0].affectedRows > 0){
                  return res.json({ updateStatus: 'Successful'});
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
        const adminUpdateStatus = await db.all('UPDATE adminusers SET accountFirstName = ?, accountLastName = ?, accountEmail = ? WHERE accountUsername = ?', [firstName, lastName, email, username]);
        if (adminUpdateStatus[0].affectedRows > 0){
          return res.json({ updateStatus: 'Successful'});
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
    const deleteStatus = await db.all('Delete FROM users WHERE accountUsername = ?', [username]);
    if (deleteStatus[0].affectedRows > 0){
      return res.json({ deleteStatus: 'Successful'});
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
    const locateUser = db.all('SELECT * FROM users WHERE accountUsername = ?', [username.toLowerCase()]);
    const locateAdmin = db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username.toLowerCase()]);

    if (typeof locateUser[0][0] !== 'undefined'){
      const checkDuplicateRecovery = db.all('SELECT * FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);

      if (typeof checkDuplicateRecovery[0][0] !== 'undefined') {
        return emailHandler.sendVerification(locateUser[0][0].accountEmail, locateUser[0][0].accountFirstName, locateUser[0][0].accountLastName, username);
      }
      else {
        const addToReovery = await db.all('INSERT INTO userrecovery (accountUsername) VALUES (?)', [username.toLowerCase()]);
      
        if (addToReovery[0].affectedRows > 0) {
          return emailHandler.sendVerification(locateUser[0][0].accountEmail, locateUser[0][0].accountFirstName, locateUser[0][0].accountLastName, username);
        }  
      }
    }
    else if (typeof locateAdmin[0][0] !== 'undefined') {
      const checkDuplicateRecovery = db.all('SELECT * FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);

      if (typeof checkDuplicateRecovery[0][0] !== 'undefined') {
        return emailHandler.sendVerification(locateAdmin[0][0].accountEmail, locateAdmin[0][0].accountFirstName, locateAdmin[0][0].accountLastName, username);
      }
      else {
        const addToReovery = await db.all('INSERT INTO userrecovery (accountUsername) VALUES (?)', [username.toLowerCase()]);

        if (addToReovery[0].affectedRows > 0) {
          return emailHandler.sendVerification(locateAdmin[0][0].accountEmail, locateAdmin[0][0].accountFirstName, locateAdmin[0][0].accountLastName, username);
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
    const foundUser = await db.all('SELECT * FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);

    if (typeof foundUser[0][0] !== 'undefined'){
      return res.json({ foundAdminAccount: true });
    }
    return res.json({ foundAdminAccount: false });
  }
  catch (err) {
    return res.json({ message: 'An Error Occurred!' });
  }
});

router.post('/recoveryverification', async (req, res) => {
  const password = req.body.password;
  const username = req.body.AccountUsername.AccountUsername;

  try {
    const locateUser = db.all('SELECT * FROM users WHERE accountUsername = ?', [username.toLowerCase()]);
    const locateAdmin = db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username.toLowerCase()]);

    if(typeof locateUser[0][0] !== 'undefined'){
      if (password != null){
        bcrypt.hash(password, saltRounds, async function(err, hash) {
          const updateStatus = await db.all('UPDATE users SET accountPassword = ? WHERE accountUsername = ?', [hash, username]);
            
          if (updateStatus[0].affectedRows > 0) {
            const deleteStatus = await db.all('DELETE FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);
            if (deleteStatus[0].affectedRows > 0) {
              return res.json({recoveryStatus: "Successful"});
            }
            return res.json({recoveryStatus: "Unsuccessful"})
          }
        });       
      }
    }
    else if (typeof locateAdmin[0][0] !== 'undefined'){
      if (password != null){
        bcrypt.hash(password, saltRounds, async function(err, hash) {
          const updateStatus = await db.all('UPDATE adminusers SET accountPassword = ? WHERE accountUsername = ?', [hash, username]);
            
          if (updateStatus[0].affectedRows > 0) {
            const deleteStatus = await db.all('DELETE FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);
            if (deleteStatus[0].affectedRows > 0) {
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
module.exports = router;