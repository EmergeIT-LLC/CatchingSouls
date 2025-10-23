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
let prodHost = process.env.HOST + ":" + process.env.PORT;

// Define allowed origins
const allowedOrigins = [clientOrigin, amplifyOrigin];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (native mobile clients, curl) and allowedOrigins
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'X-Requested-With', 'Custom-Header'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

if (prodStatus === "true") {
  prodHost = host;
  jsonHandler.testJson();
  AWS_S3_Bucket_Handler.importBackupFromS3();
}

// Middleware for setting CORS headers for routes that exist and are from allowed origin
const setHeadersForAllowedRoutes = (req, res, next) => {
  const origin = req.headers.origin;
  // allow if origin matches or origin missing (native clients)
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // if using cookies
  }
  next();
};

// Define your routes before the middleware for handling 404 errors
app.get('/', (req, res) => {
  if (prodStatus === "true") {
    res.send("The server is running successfully. <br/>The server url is " + prodHost + "...");
  }
  else {
    res.send("The server is running successfully. <br/>The server is running on port " + port + "... <br/>The server url is " + prodHost + "...");
  }
});

// Define other routes here (userRoute, adminRoute, triviaRoute, etc.)
const userRoute = require('./routes/User');
app.use('/user', setHeadersForAllowedRoutes, userRoute);

const adminRoute = require('./routes/Admin');
app.use('/admin', setHeadersForAllowedRoutes, adminRoute);

const triviaRoute = require('./routes/Trivia');
app.use('/trivia', setHeadersForAllowedRoutes, triviaRoute);

// Catch-all route for handling non-existent pages (404 errors)
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Middleware for handling errors and setting CORS headers
app.use((err, req, res, next) => {
  const originHeader = req.headers.origin || allowedOrigins.join(', ');
  res.setHeader('Access-Control-Allow-Origin', originHeader);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (err.status && err.status === 404) {
    res.redirect(host + '/PageNotFound');
  } else if (err.status) {
    return res.status(err.status).send(err.message || 'Internal Server Error');
  }
  next();
});

app.listen(port, () => {
  console.log("Server running on port " + port + "...");
});