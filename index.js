/*******************************************
 *  FIREWORKER
 *      THE DATA INCINERATOR
 *  v. 1.0.0 Beta
 ******************************************/

const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

//Instantiate express
const app = express();

//Setup secret key environment variable
process.env.SECRETKEY = "secretSAlt"

//Require models
const User = require('./models/user.js')

//connect to database
mongoose.connect('localhost/fireworker');

//use javascript global promise instea of deprecated mongoose
mongoose.Promise = global.Promise;

//log database errors to console
mongoose.connection.on('error', console.error.bind(console, "MongoDB Connection error"));

//Use CookieParser in express app
app.use(cookieParser());

//Add bodyParser to App to get post data
app.use(bodyParser.urlencoded({extended: true}));
//Authenticate Users on every page load
//This might be unnessesary

/****************************************************
 *  Check for login token on every request
 ***************************************************/
let checkAuth = (req, res, next)=>{
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    
    //Synchronous verification
    try{
      decodedToken = jwt.verify(token, process.env.SECRETKEY)
      console.log("***Auth***");
      req.user = decodedToken._id
    }catch(err){
      console.log(err.message)
    }   
  };
  next();
};

//Add checkAuth function to middleware
app.use(checkAuth);

// Set up a static directory
app.use(express.static('public'));

// Setup handlebars view engine and pass in parameters
app.engine('hbs', hbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

// Load Routes
require('./routes/router.js')(app)

// Listen on port 8180
app.listen(8180, function () {
    console.log('Fireworker listening on port 8180!');
   });