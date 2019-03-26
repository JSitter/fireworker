module.exports = (app) => {
  const pgen = require('generate-password');
  const User = require('../models/user.js');
  const jwt = require('jsonwebtoken');
  const nodemailer = require('nodemailer');
  const mg = require('nodemailer-mailgun-transport');
  const site_address = process.env.SITE || "http://localhost:"+ port;
  const bcrypt = require('bcrypt');
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.EMAIL_DOMAIN
    }
  }

  const nodemailerMailgun = nodemailer.createTransport(mg(auth));
  
  async function sendResetEmail(email_address, reset_link){

    // console.log("Reset link", reset_link)

    nodemailerMailgun.sendMail({
      from: 'no-reply@example.com',
      to: email_address, // This can be an array if there are many.
      subject: 'Fireworker Reset Password Request',
      template: {
        name: 'email.handlebars',
        engine: 'handlebars',
        context: {reset_link}
      }
    }).catch(err => {
      console.log('Error: ' + err);

    });

  }

/**************************
 *     Reset Password (GET)
 **************************/
app.get('/reset-password', (req, res)=>{
  res.render('reset-password');
})

/************************
*     Reset Password (POST)
***********************/
app.post('/reset-password', (req, res)=>{
  res.redirect('/reset-confirmation');
  console.log("User Password Reset Request:", req.body.email)
  var pw_reset_token = pgen.generate({
      length: 10,
      numbers: true
  });
   
  User.updateOne(
    {email:req.body.email}, 
    { $set: {
      pw_reset_request: new Date(),
      pw_reset_token: pw_reset_token
    }}
    ).catch( (err)=>console.log(err));

    const user_reset_link =site_address + "/reset/"+pw_reset_token+'/'+req.body.email
    sendResetEmail(req.body.email, user_reset_link).catch((err)=>{
      console.log(err)
    })

})

/************************
*     Reset Password Confirmation (GET)
************************/
app.get('/reset-confirmation', (req, res)=>{
  res.render('reset-confirmation');
})

/**********************
*     Authenticated Password Reset (GET)
**********************/
app.get('/reset/:token/:email', (req, res)=>{
  if (req.params.token){
    if (req.params.email){
      User.findOne({email:req.params.email, pw_reset_token: req.params.token}).then((user)=>{
        console.log(user)
        if( user.pw_reset_token == req.params.token){
          console.log("Login user")
          
          //logging in user
          var token = jwt.sign({ _id: user._id }, process.env.SECRETKEY, { expiresIn: "60 days" });
          res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
          res.redirect('/reset-form')
        }
      })
    }else{
      res.render('expired');
    }
  }else{
    res.render('expired');
  }

  
})

app.get('/reset-form', (req, res)=>{
  if(!req.user){
    res.redirect('/')
  }else{
    res.render('password-form')
  }
  
})

/************************
*     Authenticated Password Reset (POST)
************************/
app.post('/reset-done', (req, res)=>{
  
  let hashed_pass = '';

  console.log("reset done ", req.user);
  
  if(req.user){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        User.updateOne(
          {_id:req.user}, 
          { $set: {
            password: hash,
            pw_reset_request: "",
            pw_reset_token: ""
          }}
          ).then((user)=>{
            console.log("User data", user)
            var token = jwt.sign({ _id: user._id }, process.env.SECRETKEY, { expiresIn: "60 days" });
              res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });

              res.redirect('/u');
          }).catch( (err)=>console.log(err));
          

      });
    });

      
  }else{
    res.render('expired');
  }
  
})
};