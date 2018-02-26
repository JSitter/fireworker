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
const fileUpload = require('express-fileupload');
require('dotenv').config();

const uristring = 
  process.env.MONGODB_URI || 
  '/localhost/fireworker';

//Instantiate express
const app = express();

// use default options
app.use(fileUpload());

//Require models
const User = require('./models/user.js')

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

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

/****************************************************
 *  Check for download access on every request
 ***************************************************/
let tokenAuth = (req, res, next)=>{
  if(typeof req.cookies.transfer_token === 'undefined' || req.cookies.transfer_token === null){
    req.download_token = null;
  }else{
    //if correct cookie is set
    let token = req.cookies.transfer_token;
    //verification
    try{
      transferToken = jwt.verify(token, process.env.SECRETKEY);
      req.user = transfer_token._id;
      req.download_token = transfer_token.id;
      console.log("Download auth success");
    }catch(err){
      console.log("Transfer token authentication Failed:", err);
    }
  }
  next();
}

//Add checkAuth function to middleware
app.use(checkAuth);

//add check for download authorization to middleware
app.use(tokenAuth);

/****************************************************
 *  Check for download access
 ***************************************************/
let downloadAuth = (req, res, next)=>{
  if(typeof req.cookies.download_token === "undefined" || req.cookies.download_token === null){

  }
}

// Set up a static public directory
app.use(express.static('public'));

// Setup handlebars view engine and pass in parameters
app.engine('hbs', hbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

// Load Routes
require('./routes/router.js')(app);

// Listen on port 8180
app.listen(8180, function () {
    console.log('Fireworker listening on port 8180!');
   });
