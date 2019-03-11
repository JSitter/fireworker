module.exports = (app) => {
  const User = require('../models/user.js');
  const nodemailer = require('nodemailer');
  const mg = require('nodemailer-mailgun-transport');
  const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.EMAIL_DOMAIN
    }
  }
  const nodemailerMailgun = nodemailer.createTransport(mg(auth));
  
  app.get('/subscribe', (req, res)=>{
    res.render('subscribe-form', { stripe_api : process.env.PUBLIC_STRIPE_API_KEY})
  })
  app.post('/purchase/', (req, res)=>{
    if(req.user){
        // Set your secret key: remember to change this to your live secret key in production
      // See your keys here: https://dashboard.stripe.com/account/apikeys
      var stripe = require("stripe")(process.env.PRIVATE_STRIPE_API_KEY);

      // Token is created using Checkout or Elements!
      // Get the payment token ID submitted by the form:
      const token = req.body.stripeToken; // Using Express

      // req.body.petId can become null through seeding,
      // this way we'll insure we use a non-null value
      let userId = req.user ;

      User.findById(userId).exec((err, user) => {
        console.log("Finding user")
        if(err) {
          console.log('Error: ' + err);
          res.redirect("/");
        }
        if(user.subscription >= new Date()){
          //subscription already exists
          res.redirect('/u')
        }else{
        const charge = stripe.charges.create({
          amount: 999,
          currency: 'usd',
          description: `Purchased one Month at Fireworker.com`,
          source: token,
        }).then((chg) => {
          res.render('subscription')
          console.log("I'll give you money if this works...")
          // SEND EMAIL
          // Convert the amount back to dollars for ease in displaying in the template

          // After we get the pet so we can grab it's name, then we send the email
          nodemailerMailgun.sendMail({
            from: 'no-reply@example.com',
            to: user.email, // An array if you have multiple recipients.
            subject: 'One Month Subscription!',
            template: {
              name: 'subscription.handlebars',
              engine: 'handlebars',
              context: user
            }
          }).then(info => {
            console.log('Response: ' + info);
            res.redirect(`/u`);
          }).catch(err => {
            console.log('Error: ' + err);
            res.redirect(`/pets/${req.params.id}`);
          });
          today = new Date();
          one_month = today.setMonth(today.getMonth()+1)
          User.updateOne(
            {_id:userId}, 
            { $set: {
              subscription: one_month
            }}
            ).catch( (err)=>console.log(err));
        });
      }
      })

      }else{
        res.redirect('/');
      }
    });
}