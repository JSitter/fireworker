module.exports = (app)=>{
    const User = require('../models/user.js')
    const jwt = require('jsonwebtoken');
    //Main landing page
    app.get('/', (req, res)=>{
        res.render("home")
    })

    app.get('/sign-up', (req, res)=>{
        res.render("sign-up")
    })

    app.post('/signup', (req, res)=>{
        const user = new User(req.body);

        user.save().then((user)=>{
            console.log(user)
            // Encode JWT and set cookie
            var token = jwt.sign({ _id: user._id }, process.env.SECRETKEY, { expiresIn: "60 days" });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            res.redirect('/');
        }).catch()
    })



    app.post('/login', (req, res)=>{
        User.findOne({ email: req.body.email }, "+password", function (err, user) {
            if (!user) { return res.status(401).send({ message: 'Wrong username or password' }) };

            user.comparePassword(req.body.password, function (err, isMatch) {
              if (!isMatch) {
                return res.status(401).send({ message: 'Wrong Username or password' });
              }
        
              var token = jwt.sign({ _id: user._id }, process.env.SECRETKEY, { expiresIn: "60 days" });
              res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
              
              res.redirect('/u');
            });
          });
    });

    app.get('/u', (req, res)=>{
        if(!req.user){
            res.redirect('/sign-up');
        }else{
            res.render('user', {user: "Patrick Stewart"});
        }
        console.log("user: ",req.user)
    })

    app.get('/logout', (req, res)=>{
        res.clearCookie('nToken');
        res.redirect('/');
    })

    app.get('/login', (req, res)=>{
        res.clearCookie('nToken');
        res.redirect('/');
    });

    app.get('/offer', (req, res)=>{
        res.render('offer-document');
    })

    app.get('vaultgate', (req, res)=>{

        if (!req.files)
        return res.status(400).send('No files were uploaded.');
     
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.sampleFile;
     
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv('/imgs/filename.jpg', function(err) {
        if (err)
          return res.status(500).send(err);
     
        res.send('File uploaded!');
      });
    })

}

