require('dotenv').config();
const sendGridAPI = process.env.SENDGRID_API_KEY;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridAPI);
const businessEmail = 'catchingsoulstrivia@outlook.com';

function sendVerification(email, firstName, lastName, username) {
    //Sending Verification Email
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
        return;
    })
    .catch(error => {
        // Log friendly error
        console.error(error);

        if (error.response) {
            // Extract error msg
            const {message, code, response} = error;

            // Extract response msg
            const {headers, body} = response;

            console.error(body);
        }
    });
}

function sendAdminVerification(email, firstName, lastName, username) {
    const msg = {
        to: email,
        from: {name:'Catching Souls Admin', email: businessEmail},
        subject: 'Catching Souls Admin Account Activiation',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">You have been added as an admin to the Catching Souls site".</p>' +
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Your username is ' + username.toLowerCase() + '".</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Verify my account" below to verify your account.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + "/" + username.toLowerCase() + '/AdminTools/ManageAdminAccounts/Verification">Verify my account</a></p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        return;
    })
    .catch(error => {
        // Log friendly error
        console.error(error);

        if (error.response) {
            // Extract error msg
            const {message, code, response} = error;

            // Extract response msg
            const {headers, body} = response;

            console.error(body);
        }
    });
}

function sendRecoveryVerification(email, firstName, lastName, username) {
    const msg = {
        to: email,
        from: {name:'Catching Souls', email: businessEmail},
        subject: 'Catching Souls Account Recovery',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to provide you with your Catching Souls recovery link".</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Recover my account" below to verify your account.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + '/ForgotPasswordVerification/' + username.toLowerCase() + '">Recover my account</a></p>'
    }
    sgMail
    .send(msg)
    .then(() => {
        return;
    })
    .catch((error) => {
        console.log(error);
        return;
    });
}

module.exports = {
    sendVerification,
    sendAdminVerification,
    sendRecoveryVerification
};