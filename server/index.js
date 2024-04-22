require('dotenv').config();
const AWS_S3_Bucket_Handler = require('./config/aws/s3Handler');
const jsonHandler = require('./functions/jsonHandler');
const host = process.env.HOST;
const port = process.env.PORT;
const prodStatus = process.env.IN_PROD
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

jsonHandler.testJson();
AWS_S3_Bucket_Handler.importBackupFromS3();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Define your routes before the middleware for handling 404 errors
// Define your root route
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

// Middleware for handling errors
app.use((err, req, res, next) => {
  // Redirect only if it's a 404 error
  if (err.status === 404) {
    res.redirect(process.env.ClientHost);
  } else {
    // For other errors, handle as needed
    // For example, you can send an error response
    res.status(err.status || 500).send(err.message || 'Internal Server Error');
  }
});

app.listen(port, () => {
  console.log("Server running on port " + port + "...");
});
