const db = require('../dbConnection');

async function verifiedUserCheckEmail(email) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users WHERE accountEmail = ?', [email], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function verifiedUserCheckUsername(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function unverifiedUserCheckEmail(email) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM usersverification WHERE accountEmail = ?', [email], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function unverifiedUserCheckUsername(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM usersverification WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function addUser(username, firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO usersverification (accountUsername, accountFirstName, accountLastName, accountEmail, accountPassword) VALUES (?, ?, ?, ?, ?)', [username.toLowerCase(), firstName, lastName, email.toLowerCase(), password], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function locateVerifiedUserData(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if duplicate user found, false otherwise
            }
        });
    });
}

async function locateUnverifiedUserData(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM usersverification WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if duplicate user found, false otherwise
            }
        });
    });
}

async function locateRecoveryUserData(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM userrecovery WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if duplicate user found, false otherwise
            }
        });
    });
}

async function moveUser(username, firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (accountUsername, accountFirstName, accountLastName, accountEmail, accountPassword) VALUES (?, ?, ?, ?, ?)', [username, firstName, lastName, email, password], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                console.log(this.change > 0);
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function removeUnverifiedUserUsername(username) {
    return new Promise((resolve, reject) => {
        db.run('Delete FROM usersverification WHERE accountUsername = ?', [username], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function removeVerifiedUserUsername(username) {
    return new Promise((resolve, reject) => {
        db.run('Delete FROM users WHERE accountUsername = ?', [username], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function updateUserAccountWithPW(username, firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE users SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountPassword = ? WHERE accountUsername = ?', [firstName, lastName, email, password, username], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function updateUserAccountWithoutPW(username, firstName, lastName, email) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO usersverification (accountUsername, accountFirstName, accountLastName, accountEmail) VALUES (?, ?, ?, ?)', [username, firstName, lastName, email], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function insertIntoUserRecovery(username, firstName, lastName, email) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO userrecovery (accountUsername) VALUES (?)', [username], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function locateUserInRecovery(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM userrecovery WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function recoverAccountInRecoverPW(newPassword, username) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE users SET accountPassword = ? WHERE accountUsername = ?', [newPassword, username], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function removeUserFromRecovery(username) {
    return new Promise((resolve, reject) => {
        db.run('Delete FROM userrecovery WHERE accountUsername = ?', [username], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

module.exports = {
    verifiedUserCheckEmail,
    verifiedUserCheckUsername,
    unverifiedUserCheckEmail,
    unverifiedUserCheckUsername,
    addUser,
    locateVerifiedUserData,
    locateUnverifiedUserData,
    moveUser,
    removeUnverifiedUserUsername,
    removeVerifiedUserUsername,
    updateUserAccountWithPW,
    updateUserAccountWithoutPW,
    insertIntoUserRecovery,
    locateUserInRecovery,
    recoverAccountInRecoverPW,
    removeUserFromRecovery
}