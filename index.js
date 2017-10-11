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

//Require models
//need mo models

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

// Setup handlebars view engine and pass in parameters
app.engine('hbs', hbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

app.get('/', (req, res)=>{
    res.render("home.hbs")
})

/****************************************************
 *  Check for login token on every request
 ***************************************************/
var checkAuth = function (req, res, next) {
    
    console.log("***Mo Auth***");
  
    if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
      req.user = null;
    } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      req.user = decodedToken.payload;
    };
  
    next();
  };

//Authenticate Users on every page load
app.use(checkAuth);

// Listen on port 8180
app.listen(8180, function () {
    console.log('Fireworker listening on port 8180!');
   });