require('dotenv').config();
const sendGridAPI = process.env.SENDGRID_API_KEY;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridAPI);
const businessEmail = 'catchingsoulstrivia@outlook.com';
const businessPOCEmail = 'jonathan.dameus@emerge-it.net';

function sendVerification(email, firstName, lastName, username) {
    const sentEmail = false;
    const msg = {
    to: email,
    from: {name:'Catching Souls', email: businessEmail},
    subject: 'Catching Souls Account Activiation',
    html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
    '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Thank you for registering with "Catching Souls".</p>' +
    '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Verify my account" below to verify your account.</p>' +
    '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + "/AccountVerification/" + username.toLowerCase() + '">Verify my account</a></p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

function sendAdminVerification(email, firstName, lastName, username) {
    sentEmail = false;
    const msg = {
        to: email,
        from: {name:'Catching Souls Admin', email: businessEmail},
        subject: 'Catching Souls Admin Account Activiation',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">You have been added as an admin to the Catching Souls site.</p>' +
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Your username is ' + username.toLowerCase() + '.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Verify my account" below to verify your account.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + "/" + username.toLowerCase() + '/AdminTools/ManageAdminAccounts/Verification">Verify my account</a></p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

function sendRecoveryVerification(email, firstName, lastName, username) {
    sentEmail = false;
    const msg = {
        to: email,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'Catching Souls Account Recovery',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to provide you with your Catching Souls recovery link.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Recover my account" below to verify your account.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + '/ForgotPasswordVerification/' + username.toLowerCase() + '">Recover my account</a></p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

// DATABASE RELATED EMAILS
function sendDatabaseBackupNotification() {
    sentEmail = false;
    const msg = {
        to: businessPOCEmail,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'Database Backup Notification',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello Jonathan Dameus, </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to let you know the database backup has initiated.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">You will be notified when the backup has completed. </p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

function sendDatabaseBackupResultsNotification(status, logs) {
    sentEmail = false;
    const msg = {
        to: businessPOCEmail,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'Database Backup Results Notification',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello Jonathan Dameus, </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to let you know the status of the database backup.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">The database backup completed with a status of </p>' + status + 
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Logs: </p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">' + logs + '</p>'
    }

    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

function sendDatabaseImportNotification() {
    sentEmail = false;
    const msg = {
        to: businessPOCEmail,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'Database Import Notification',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello Jonathan Dameus, </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to let you know the database import has initiated.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">You will be notified when the import has completed. </p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

function sendDatabaseImportResultsNotification(status, logs) {
    sentEmail = false;
    const msg = {
        to: businessPOCEmail,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'Catching Souls Database Import Results',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello Jonathan Dameus, </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to let you know the status of the database import.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">The database import completed with a status of </p>' + status + 
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Logs: </p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">' + logs + '</p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

function sendUsersQuestionAnswerNotice(firstName, lastName, triviaQ, triviaA, triviaS) {
    sentEmail = false;
    const msg = {
        to: businessPOCEmail,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'New Catching Souls Trivia Question Recieved',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello Jonathan Dameus, </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to let you know that you have recieved a new trivia question.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Sender: ' + firstName + " " + lastName + '</p>' + 
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Question: ' + triviaQ + '</p>' + 
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Answer: ' + triviaA + '</p>'  + 
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Supporting Verse: ' + triviaS + '</p>' 
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

function sendUsersQuestionAnswerRecievedNotice(email, firstName, lastName) {
    sentEmail = false;
    const msg = {
        to: email,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'Your Trivia Question Has Recieved',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to let you know that we have received your trivia question.</p>' +
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">We will review your question and add it to the list if applicable.</p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        sentEmail = true;
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    });
    return sentEmail;
}

module.exports = {
    sendVerification,
    sendAdminVerification,
    sendRecoveryVerification,
    sendDatabaseBackupNotification,
    sendDatabaseBackupResultsNotification,
    sendDatabaseImportNotification,
    sendDatabaseImportResultsNotification,
    sendUsersQuestionAnswerNotice,
    sendUsersQuestionAnswerRecievedNotice
};