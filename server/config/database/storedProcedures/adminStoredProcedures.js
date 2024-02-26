const db = require('../dbConnection');

async function verifiedAdminCheckEmail(email) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM adminusers WHERE accountEmail = ?', [email], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function verifiedAdminCheckUsername(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function unverifiedAdminCheckEmail(email) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM adminusersverification WHERE accountEmail = ?', [email], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function unverifiedAdminCheckUsername(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows.length > 0); // Resolve with true if duplicate user found, false otherwise
            }
        });
    });
}

async function addAdmin(username, firstName, lastName, email, password) {
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

async function locateVerifiedAdminData(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM adminusers WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if duplicate user found, false otherwise
            }
        });
    });
}

async function locateUnverifiedAdminData(username) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM adminusersverification WHERE accountUsername = ?', [username], (err, rows) => {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(rows); // Resolve with data if duplicate user found, false otherwise
            }
        });
    });
}

async function moveAdmin(username, firstName, lastName, email, password) {
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

async function removeUnverifiedAdminUsername(username) {
    return new Promise((resolve, reject) => {
        db.run('Delete FROM usersverification WHERE accountUsername = ?', [username.toLowerCase()], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function updateAdminAccountWithPW(username, firstName, lastName, email, password) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE adminUsers SET accountFirstName = ?, accountLastName = ?, accountEmail = ?, accountPassword = ? WHERE accountUsername = ?', [firstName, lastName, email, password, username], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

async function updateAdminAccountWithoutPW(username, firstName, lastName, email) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO adminUsers (accountUsername, accountFirstName, accountLastName, accountEmail) VALUES (?, ?, ?, ?)', [username, firstName, lastName, email], function (err) {
            if (err) {
                reject({ message: 'A Database Error Occurred!', errorMessage: err.message });
            } else {
                resolve(this.changes > 0); // Resolve with true if row was added successfully, false otherwise
            }
        });
    });
}

module.exports = {
    verifiedAdminCheckEmail,
    verifiedAdminCheckUsername,
    unverifiedAdminCheckEmail,
    unverifiedAdminCheckUsername,
    addAdmin,
    locateVerifiedAdminData,
    locateUnverifiedAdminData,
    moveAdmin,
    removeUnverifiedAdminUsername,
    updateAdminAccountWithPW,
    updateAdminAccountWithoutPW
}