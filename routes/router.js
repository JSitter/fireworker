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
        if(!req.user){
            res.redirect('/login');
        }else{
            res.render('offer-document');
        }
        
    })

    /**************************************
     *  Post Save User Record
     **************************************/
    app.post('/vaultgate', (req, res)=>{
        
        if(!req.user){
            res.status(401).send('User not logged in.');
        }else{

            if (!req.files)
            return res.status(400).send('No files were uploaded.');
            // console.log("This file is " + __filename);
            // console.log("It's located in " + __dirname);
            // The name of the input field is used to retrieve the uploaded file
            let userFile = req.files.userDocument;

            let userFileName = userFile.name
            let userID = req.user._id

            console.log("filename: ", userFileName)
            console.log("userid", userID)
            // Use the mv() method to place file on server
            // THIS BLOCK WORKS COMMENTED OUT FOR DEV PURPOSES
            // userFile.mv(__dirname + '/../uservault/'+ +new Date + ".jpg", function(err) {
            // if (err)
            // return res.status(500).send(err);
            //     res.send('File uploaded!');
            // });
        }
    });
}

