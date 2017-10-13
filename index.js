/*******************************************
 *  FIREWORKER
 *      THE DATA DISTRINCINERATOR
 *  v. 1.0.0 Beta
 ******************************************/

const express = require('express');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

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

// Set up a static directory
app.use(express.static('public'));

// Setup handlebars view engine and pass in parameters
app.engine('hbs', hbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

// Load Routes
require('./routes/router.js')(app)

/****************************************************
 *  Check for login token on every request
 ***************************************************/
var checkAuth = function (req, res, next) {
    
    console.log("***Mo Auth***");
  
    if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      
      //verify if token is authentic
      jwt.verify(token, process.env.SECRETKEY, function(err, decodedToken) {
        if(err){
          console.log(err.message)
          res.redirect("/")
        }else{
          // verification passed
          req.user = decodedToken.payload;
        }
      });      
    };
  
    next();
  };

//Authenticate Users on every page load
app.use(checkAuth);

// Listen on port 8180
app.listen(8180, function () {
    console.log('Fireworker listening on port 8180!');
   });