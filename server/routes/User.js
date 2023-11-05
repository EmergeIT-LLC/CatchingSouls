require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const sg = require('../config/emailTemplate');
//----------------------------------------- BEGINNING OF PASSPORT MIDDLEWARE AND SETUP ---------------------------------------------------
function requireAuth(req, res, next) {
  if (req.cookies.username) {
    next(); // User is authenticated, proceed to the route
  } else {
    res.json({ message: 'Unauthorized' });
  }
}

// Example usage to protect a route
router.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'This is a protected route' });
});
//----------------------------------------- END OF PASSPORT MIDDLEWARE SETUP ---------------------------------------------------
//----------------------------------------- REGISTER AND VERIFICATION SETUP ---------------------------------------------------
//Register page communication
router.post('/register', async (req, res) => {
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const checkDuplicateVerifiedUser = await db.query('SELECT * FROM users WHERE accountEmail = ?', [email]);
  const checkDuplicateUnverifiedUser = await db.query('SELECT * FROM userverification WHERE accountEmail = ?', [email]);

  try {
    if (typeof checkDuplicateVerifiedUser[0][0] !== 'undefined') {
      return res.json({ message: 'User already registered!' });
    }
    else if (typeof checkDuplicateUnverifiedUser[0][0]  !== 'undefined'){
      sg.sendVerification(email, firstName, lastName, username);
      return res.json({ message: 'User needs to check email to verify account'});
    }
    else {
      bcrypt.hash(password, saltRounds, async function(err, hash) {
        try {
          //Add user to verification table
          const setVerification = await db.query('INSERT INTO userverification (accountUsername, accountFirstName, accountLastName, accountEmail, accountPassword) VALUES (?, ?, ?, ?, ?)', [username.toLowerCase(), firstName, lastName, email.toLowerCase(), hash]);

          if (setVerification[0].affectedRows > 0) {
            sg.sendVerification(email, firstName, lastName, username);
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
    return res.json({ message: 'An Error Occured!' });
  }
});

//Locate User on Verification Table
router.post('/verificationInfo', async (req, res) => {
  const username = req.body.AccountUsername.AccountUsername;

  try {
    const locatedUnverifiedUser = await db.query('SELECT * FROM userverification WHERE accountUsername = ?', [username]);

    if (typeof locatedUnverifiedUser[0][0] !== 'undefined') {
      return res.json({foundAccount: true});
    }
    else {
      return res.json({foundAccount: false});
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!' });
  }
});

//Move user from verification table to accounts table
router.post('/verifyUser', async (req, res) => {
  const username = req.body.AccountUsername.AccountUsername;
  
  try {
    const unverifiedUser = await db.query('SELECT * FROM userverification WHERE accountUsername = ?', [username]);

    if (typeof unverifiedUser[0][0] !== 'undefined'){
      const movingUser = await db.query('INSERT INTO users (accountUsername, accountFirstName, accountLastName, accountEmail, accountPassword) VALUES (?, ?, ?, ?, ?)', [unverifiedUser[0][0].accountUsername, unverifiedUser[0][0].accountFirstName, unverifiedUser[0][0].accountLastName, unverifiedUser[0][0].accountEmail, unverifiedUser[0][0].accountPassword]);
      
      if (movingUser[0].affectedRows > 0) {
        const deletingUser = await db.query('Delete FROM userverification WHERE accountUsername = ?', [username]);
        
        if (deletingUser[0].affectedRows > 0) {
          return res.json({Verified: true});
        }
      }
      return res.json({Verified: false});
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!' });
  } 
});
//----------------------------------------- LOGIN SETUP ---------------------------------------------------
//Login Page
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const userVerification = await db.query('SELECT * FROM userverification WHERE accountUsername = ?', [username]);
    const userLogin = await db.query('SELECT * FROM users WHERE accountUsername = ?', [username]);
    const adminVerification = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);
    const adminLogin = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);

    // Check User Verification
    if (typeof userVerification[0][0] !== 'undefined') {
      sg.sendVerification(userVerification[0][0].accountEmail, userVerification[0][0].accountFirstName, userVerification[0][0].accountLastName, username);
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
        req.cookies.username = username;
        req.cookies.loggedIn = true;
        req.cookies.isAdmin = false;
        res.cookie('loggedIn', 'true');
        res.cookie('username', username);
        res.cookie('isAdmin', 'false');
        return res.json({ loggedIn: true, username: username });
      }
      else {
        return res.json({ loggedIn: false, message: 'Account Does Not Exist or Password Is Incorrect!' });
      }
    }
    // Check Admin Verification
    else if (typeof adminVerification[0][0] !== 'undefined') {
      sg.sendAdminVerification(adminVerification[0][0].accountEmail, adminVerification[0][0].accountFirstName, adminVerification[0][0].accountLastName, username);
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
        req.cookies.username = username;
        req.cookies.loggedIn = true;
        req.cookies.isAdmin = true;
        res.cookie('loggedIn', 'true');
        res.cookie('username', username);
        res.cookie('isAdmin', 'true');
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
    return res.json({ message: 'An Error Occured!' });
  }
});
router.post('/checkLogin', (req, res) => {
  // Check for HTTP-only cookies and respond accordingly
  const isAdmin = req.cookies.isAdmin === 'true';
  const loggedIn = req.cookies.loggedIn === 'true';
  const username = req.cookies.username;

  if (isAdmin && loggedIn && username) {
    // User is logged in, send appropriate data
    return res.json({ loggedIn: true, username: username, isAdmin: isAdmin });
  } 
  else if (loggedIn && username) {
    return res.json({ loggedIn: true, username: username });
  }
  else {
    // User is not logged in, send appropriate data
    return res.json({ loggedIn: false });
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
  const username = req.cookies.username;

  try {
    const locateUser = await db.query('SELECT * FROM users WHERE accountUsername = ?', [username]);
    const locateUnverifiedUser = await db.query('SELECT * FROM userverification WHERE accountUsername = ?', [username]);
    const locateAdmin = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username]);
    const locateUnverifiedAdmin = await db.query('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username]);

    if (typeof locateUser[0][0] !== 'undefined'){
      return res.send(locateUser[0][0]);
    }
    else if (typeof locateUnverifiedUser[0][0] !== 'undefined'){
      return res.send(locateUnverifiedUser[0][0]);
    }
    else if (typeof locateAdmin[0][0] !== 'undefined'){
      return res.send(locateAdmin[0][0]);
    }
    else if (typeof locateUnverifiedAdmin[0][0] !== 'undefined'){
      return res.send(locateUnverifiedAdmin[0][0]);
    }
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!' });
  }
});

//Update Account
router.post('/account_Update', async (req, res) => {
  const username = req.cookies.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const currentPassword = req.body.password;
  const newPassword = req.body.newPassword;

  try {
    isUser = await db.query('SELECT * FROM users WHERE accountUsername = ?', [username.toLowerCase()]);
    isAdmin = await db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username.toLowerCase()]);

    if (typeof isUser[0][0] !== 'undefined') {
      if (currentPassword != null) {
        bcrypt.compare(currentPassword, isUser[0][0].accountPassword, async (err, result) => {
          if (result == true) {
            bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
              if (err) {
                return res.json({ message: 'An Error Occured!' });
              }
              else {
                const userUpdateStatus = await db.query('UPDATE users SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountPassword = ? WHERE accountUsername = ?', [firstName, lastName, email, hash, username]);
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
        const userUpdateStatus = await db.query('UPDATE users SET accountFirstName = ?, accountLastName = ?, accountEmail = ? WHERE accountUsername = ?', [firstName, lastName, email, username]);
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
                return res.json({ message: 'An Error Occured!' });
              }
              else {          
                const adminUpdateStatus = await db.query('UPDATE adminusers SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountPassword = ? WHERE accountUsername = ?', [firstName, lastName, email, hash, username]);
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
        const adminUpdateStatus = await db.query('UPDATE adminusers SET accountFirstName = ?, accountLastName = ?, accountEmail = ? WHERE accountUsername = ?', [firstName, lastName, email, username]);
        if (adminUpdateStatus[0].affectedRows > 0){
          return res.json({ updateStatus: 'Successful'});
        }
        return res.json({ updateStatus: 'Unsuccessful'});
      }
    }
  }
  catch(err) {
    return res.json({ message: 'An Error Occured!' });
  }
});

//Delete Account
router.post('/account_Delete', async (req, res) => {
  const username = req.cookies.username;

  try {
    const deleteStatus = await db.query('Delete FROM users WHERE accountUsername = ?', [username]);
    if (deleteStatus[0].affectedRows > 0){
      return res.json({ deleteStatus: 'Successful'});
    }
    return res.json({ deleteStatus: 'Unsuccessful'});
  }
  catch (err) {
    return res.json({ message: 'An Error Occured!' });
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
    const locateUser = db.query('SELECT * FROM users WHERE accountUsername = ?', [username.toLowerCase()]);
    const locateAdmin = db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username.toLowerCase()]);

    if (typeof locateUser[0][0] !== 'undefined'){
      const checkDuplicateRecovery = db.query('SELECT * FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);

      if (typeof checkDuplicateRecovery[0][0] !== 'undefined') {
        return sg.sendVerification(locateUser[0][0].accountEmail, locateUser[0][0].accountFirstName, locateUser[0][0].accountLastName, username);
      }
      else {
        const addToReovery = await db.query('INSERT INTO userrecovery (accountUsername) VALUES (?)', [username.toLowerCase()]);
      
        if (addToReovery[0].affectedRows > 0) {
          return sg.sendVerification(locateUser[0][0].accountEmail, locateUser[0][0].accountFirstName, locateUser[0][0].accountLastName, username);
        }  
      }
    }
    else if (typeof locateAdmin[0][0] !== 'undefined') {
      const checkDuplicateRecovery = db.query('SELECT * FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);

      if (typeof checkDuplicateRecovery[0][0] !== 'undefined') {
        return sg.sendVerification(locateAdmin[0][0].accountEmail, locateAdmin[0][0].accountFirstName, locateAdmin[0][0].accountLastName, username);
      }
      else {
        const addToReovery = await db.query('INSERT INTO userrecovery (accountUsername) VALUES (?)', [username.toLowerCase()]);

        if (addToReovery[0].affectedRows > 0) {
          return sg.sendVerification(locateAdmin[0][0].accountEmail, locateAdmin[0][0].accountFirstName, locateAdmin[0][0].accountLastName, username);
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
    const foundUser = await db.query('SELECT * FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);

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
    const locateUser = db.query('SELECT * FROM users WHERE accountUsername = ?', [username.toLowerCase()]);
    const locateAdmin = db.query('SELECT * FROM adminusers WHERE accountUsername = ?', [username.toLowerCase()]);

    if(typeof locateUser[0][0] !== 'undefined'){
      if (password != null){
        bcrypt.hash(password, saltRounds, async function(err, hash) {
          const updateStatus = await db.query('UPDATE users SET accountPassword = ? WHERE accountUsername = ?', [hash, username]);
            
          if (updateStatus[0].affectedRows > 0) {
            const deleteStatus = await db.query('DELETE FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);
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
          const updateStatus = await db.query('UPDATE adminusers SET accountPassword = ? WHERE accountUsername = ?', [hash, username]);
            
          if (updateStatus[0].affectedRows > 0) {
            const deleteStatus = await db.query('DELETE FROM userrecovery WHERE accountUsername = ?', [username.toLowerCase()]);
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