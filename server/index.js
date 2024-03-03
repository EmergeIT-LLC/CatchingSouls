require('dotenv').config();
const host = process.env.HOST;
const port = process.env.PORT;
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const SqlDbStore = require('express-mysql-session')(session); // Import SqlDbStore
const cookieParser = require('cookie-parser');

const sessionStore = new SqlDbStore({
  host: process.env.DB_Host,
  port: process.env.DB_Port,
  user: process.env.DB_User,
  password: process.env.DB_Pass,
  database: process.env.DB_Data,
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("The server is running successfully. <br/>The server is running on port " + port + "... <br/>The server url is " + host + "...")
});

const userRoute = require('./routes/User');
app.use('/user', userRoute);

const adminRoute = require('./routes/Admin');
app.use('/admin', adminRoute);

const triviaRoute = require('./routes/Trivia');
app.use('/trivia', triviaRoute);

app.listen(port, (req, res) => (
  console.log("Server running on port " + port + "...")
));