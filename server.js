var path = require('path');
var express = require('express');
const process = require('process');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Session = require('./models/session.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const DB = require('./utils/db.js')(process.env.MONGODB_URI || 'mongodb://localhost:27017/fireworker');

const app = require('./utils/init.js')();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const verifyToken = function(token){
      //Synchronous verification
      try{
        decodedToken = jwt.verify(token, process.env.SECRETKEY)
        Session.find({userId: decodedToken._id}, (err, session) => {
          const curtime = new Date().getTime();
          try {
            if(session[0].valid && session[0].expire > curtime){

              if(token === session[0].token){
                return decodedToken
              }
              
            }
            console.log('invalid session');

          }catch(err){
            console.log("Error occurred finding session")
            return false
          }

        })

        return decodedToken;
      }catch(err){
        console.log("Token Verification Failed: ", err.message);
        return false;
      }
}

// Heroku compliant https redirect
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

const checkAuth = (req, res, next) => {
  if(typeof req.cookies.fToken === 'undefined' || req.cookies.fToken === null){
    if(req.body.sessionId){
      
      decodedToken = verifyToken(req.body.sessionId);

      if(decodedToken){
        req.user = decodedToken._id;
      }else {
        req.user = null;
      }
      console.log(req.user)
    }
  }else {
    decodedToken = verifyToken(req.cookies.fToken)
    if(decodedToken){
      req.user = decodedToken._id;
    }else {
      req.user = null;
    }
  }

  next();
}

app.use(checkAuth);

require('./routes/user')(app);

app.set('port', process.env.PORT || 8085);
var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ', server.address().port);
});
