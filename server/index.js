require('dotenv').config();
const AWS_S3_Bucket_Handler = require('./config/aws/s3Handler');
const jsonHandler = require('./functions/jsonHandler');
const host = process.env.HOST;
const port = process.env.PORT;
const prodStatus = process.env.IN_PROD;
const clientOrigin = process.env.ClientHost;
const amplifyOrigin = process.env.AmplifyHost;
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const allowedOrigins = [
  clientOrigin,
  amplifyOrigin
];

app.use(cors());
app.use(express.json());
app.use(cookieParser());

if (prodStatus === "true") {
  jsonHandler.testJson();
  AWS_S3_Bucket_Handler.importBackupFromS3();
}

// Define your routes before the middleware for handling 404 errors
app.get('/', (req, res) => {
  res.send("The server is running successfully. <br/>The server is running on port " + port + "... <br/>The server url is " + host + "...")
});

// Define other routes here (userRoute, adminRoute, triviaRoute, etc.)
const userRoute = require('./routes/User');
app.use('/user', userRoute);

const adminRoute = require('./routes/Admin');
app.use('/admin', adminRoute);

const triviaRoute = require('./routes/Trivia');
app.use('/trivia', triviaRoute);

// Middleware for handling 404 errors
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Middleware for handling errors and setting CORS headers
app.use((err, req, res, next) => {
  // For 404 errors, send a 404 response
  if (err.status === 404) {
    res.redirect(clientOrigin);
  } else {
    // Set CORS headers to allow requests from the allowed origins
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Origin", allowedOrigins.join(', ')); // Use your environment variable for the allowed origin
    res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  
    // For other errors, send 500 error response
    res.status(err.status || 500).send(err.message || 'Internal Server Error');
  }
});

app.listen(port, () => {
  console.log("Server running on port " + port + "...");
});