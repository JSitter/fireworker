module.exports = (app)=>{
    const User = require('../models/user.js')
    const Record = require('../models/record.js')
    const jwt = require('jsonwebtoken');

/****************************************************
 *  Main landing page
 ***************************************************/
    //Main landing page
    app.get('/', (req, res)=>{
        res.render("home")
    })

/****************************************************
 *  User Signup
 ***************************************************/
    //User Signup
    app.get('/sign-up', (req, res)=>{
        res.render("sign-up")
    })

/****************************************************
 *  Retrieve Post signup data
 ***************************************************/
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

/****************************************************
 *  User Login
 ***************************************************/
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

/****************************************************
 *  User home page
 ***************************************************/
    app.get('/u', (req, res)=>{
        if(!req.user){
            res.redirect('/sign-up');
        }else{
            User.findById(req.user).populate('Record').then((u)=>{
                console.log(u)
                res.render('user', {user: u});
            }).catch((err)=>{
                console.log("user page error: ",err.message)
            })
            
        }
        console.log("user: ",req.user)
    })

/****************************************************
 * Logout User
 ***************************************************/
    app.get('/logout', (req, res)=>{
        res.clearCookie('nToken');
        res.redirect('/');
    })

/****************************************************
 *  User Login redirect
 ***************************************************/
    app.get('/login', (req, res)=>{
        res.clearCookie('nToken');
        res.redirect('/');
    });

/****************************************************
 *  User Save Document
 ***************************************************/
    app.get('/upload', (req, res)=>{
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

            //save user
            let user; 
            const owner_id = req.user
            const userFile = req.files.userDocument;
            const local_address = +new Date + ".jpg"

            // Use the mv() method to place file on server
            // THIS BLOCK WORKS COMMENTED OUT FOR DEV PURPOSES

            userFile.mv(__dirname + '/../uservault/'+ local_address, function(err) {
                if (err)
                return res.status(500).send(err);
                
                    User.findById(owner_id).then((u)=>{
                        user = u;
                        
                        const user_filename = userFile.name

                        // console.log("filename: ", user_filename)
                        // console.log("userid", owner_id)
                        // console.log("local filename:", local_address)
        
                        let userRecord = new Record({local_address, owner_id, user_filename})
                        return userRecord.save()
                    }).then((record)=>{
                        user.records.unshift(record);
                        return user.save()
                    }).then(()=>{
                        res.redirect('/u')
                    }).catch((err)=>{
                        console.log(err.message)
                    })   
                });
        }
    });
}

