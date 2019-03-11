module.exports = (app) => {
  const pgen = require('generate-password');
  const User = require('../models/user.js');
  const jwt = require('jsonwebtoken');
  const nodemailer = require('nodemailer');
  const mg = require('nodemailer-mailgun-transport');
  const site_address = process.env.SITE || "localhost:"+ port

  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.EMAIL_DOMAIN
    }
  }
  const nodemailerMailgun = nodemailer.createTransport(mg(auth));
  async function sendResetEmail(email_address, reset_link){
    // After we get the pet so we can grab it's name, then we send the email
    console.log("Reset link", reset_link)

    nodemailerMailgun.sendMail({
      from: 'no-reply@example.com',
      to: email_address, // An array if you have multiple recipients.
      subject: 'Fireworker Reset Password Request',
      template: {
        name: 'email.handlebars',
        engine: 'handlebars',
        context: {reset_link}
      }
    }).then(info => {
      console.log('Response: ' + info);
      
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

    const user_reset_link ="http://"+site_address + "/reset/"+pw_reset_token+'/'+req.body.email
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
      })
    }
  }

  res.render('expired');
})

/************************
*     Authenticated Password Reset (POST)
************************/
app.post('/reset', (req, res)=>{
  res.render('expired');
})
};