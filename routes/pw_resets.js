module.exports = (app) => {
  const pgen = require('generate-password');
  const User = require('../models/user.js');
  const jwt = require('jsonwebtoken');
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
  
  var password = pgen.generate({
      length: 10,
      numbers: true
  });
   
  User.findOne({email:req.body.email}).then( (user) =>{
      console.log(user);
  })
  console.log(password);

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
app.get('/reset/:token', (req, res)=>{
  res.render('expired');
})

/************************
*     Authenticated Password Reset (POST)
************************/
app.post('/reset', (req, res)=>{
  res.render('expired');
})
};