module.exports = (app)=>{
  let twilio = require('twilio');

  async function sendSMS(phoneNumber, message){
    let accountSid = process.env.TWILIO_SID;
    let authToken = process.env.TWILIO_AUTH; 

    var twilio = require('twilio');
    var client = new twilio(accountSid, authToken);
    await client.messages.create({
        body: message,
        to: phoneNumber,  
        from: process.env.TWILIO_PHONE 
    }).then((message) => console.log("Message Delivered ", message));
  }

  app.post('/send-link/', (req, res)=>{
    userName = "James"
    if(req.user){
      userMessage = userName + ' has a secure document to send you. Retrieve it from this link: '+req.body.hiddenLink
      
      console.log(userMessage)

      sendSMS(req.body.recipientphone, userMessage).catch((err)=>{
        console.log(err)
      })


      res.redirect('/u')
    }else{
      res.redirect('/');
    }
  })
}