const db = require('./dbConnection');

async function verifiedUserCheck(email) {
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

async function unverifiedUserCheck(email) {
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

module.exports = {
    verifiedUserCheck,
    unverifiedUserCheck,
    addUser
}