require('dotenv').config(); // Load environment variables
const nodemailer = require('nodemailer');
const adminEmailUser = process.env.ADMIN_EMAILUSER;
const adminEmailPass = process.env.ADMIN_EMAILPASS;

let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: adminEmailUser,
        pass: adminEmailPass
    }
});

function sendVerification(email, firstName, lastName, username) {
    //Sending Verification Email
    let mailOptions = {
        from: {name:'Catching Souls', adminEmailUser}, // Sender's email address
        to: email, // Receiver's email address
        subject: 'Catching Souls Account Verification',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Thank you for registering with "Catching Souls".</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Verify my account" below to verify your account.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + "/AccountVerification/" + username.toLowerCase() + '">Verify my account</a></p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred:', error);
        }
        console.log('Email sent:', info.response);
    });
}

function sendAdminVerification(email, firstName, lastName, username) {
    //Sending Verification Email
    let mailOptions = {
        from: {name:'Catching Souls', adminEmailUser}, // Sender's email address
        to: email, // Receiver's email address
        subject: 'Catching Souls Admin Account Verification',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">You have been added as an admin to the Catching Souls site".</p>' +
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Your username is ' + username.toLowerCase() + '".</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Verify my account" below to verify your account.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + "/" + username.toLowerCase() + '/AdminTools/ManageAdminAccounts/Verification">Verify my account</a></p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred:', error);
        }
        console.log('Email sent:', info.response);
    });
}

function sendRecoveryVerification(email, firstName, lastName, username) {
    //Sending Verification Email
    let mailOptions = {
        from: {name:'Catching Souls', adminEmailUser}, // Sender's email address
        to: email, // Receiver's email address
        subject: 'Catching Souls Account Recovery',
        html: '<h1 style="font-size: 22px; font-family: Montserrat, sans-serif;">Hello ' + firstName + ' ' + lastName + ', </h1>' + 
        '\n\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">This email is to provide you with your Catching Souls recovery link".</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;">Kindly click "Recover my account" below to verify your account.</p>' +
        '\n<p style="font-size: 16px; font-family: Montserrat, sans-serif;"><a href="'+ process.env.ClientHost + '/ForgotPasswordVerification/' + username.toLowerCase() + '">Recover my account</a></p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred:', error);
        }
        console.log('Email sent:', info.response);
    });
}

module.exports = {
    sendVerification,
    sendAdminVerification,
    sendRecoveryVerification
};