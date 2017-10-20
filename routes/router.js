module.exports = (app)=>{
    const User = require('../models/user.js')
    const Record = require('../models/record.js')
    const Transfer = require('../models/transfer')
    const jwt = require('jsonwebtoken')
    const fs = require('fs')

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
            res.redirect('/u');
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
            res.redirect('/');
        }else{
            User.findById(req.user).populate(
               'records'
            ).then((u)=>{
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
 *  Login redirect
 ***************************************************/
    app.get('/login', (req, res)=>{
        res.clearCookie('nToken');
        res.redirect('/');
    });

/****************************************************
 *  Save User Document
 ***************************************************/
    app.get('/upload', (req, res)=>{
        if(!req.user){
            res.redirect('/login');
        }else{
            res.render('offer-document');
        }
    })

/**************************************
 *  Post Handle User Record Submission
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
            const local_dir = __dirname + '/../uservault/'

            //Check make directory uservault if it doesn't exist
            if (!fs.existsSync(local_dir)){
                fs.mkdirSync(local_dir);
            }

            // Use the mv() method to place file on server
            userFile.mv(local_dir + local_address, function(err) {
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

    /*********************************************
     *  /tokenate 
     *      Gets (via POST) ids of docs to make available
     *      and returns link to retrieve them
     ********************************************/

     app.post('/tokenate', (req, res)=>{

        console.log("path tokenate - current user id:", req.user)
         if(!req.user){
             //User Cookie Invalid
             console.log("Invalid user credentials.")
             res.send("Unable to authenticate user.")
         }else{
             //Create Security Token


            //save data for transfer record
            const owner_id = req.user
            const valid_time = +Date
            const record_ids = req.body

            //Create Security Token
            let token = jwt.sign({ owner_id, valid_time, record_ids }, process.env.SECRETKEY, { expiresIn: "60 days" })
            token = token.split('.')
            console.log("split jwt:",token[2])


            //Create new Transfer record
            transfer = new Transfer();

            //get number of records to insert
            total_records = Object.keys(req.body).length
            
            //get record ids from user
             for( index in req.body ){
                 //add document id to transfer record

                 
             }
            // console.log("records array:", records[0]._id)

            //console.log("body", req.body)



            res.send('test')
         }

     })

    /*********************************************
     *  /access/:token
     *      Access user's documents
     ********************************************/
    app.get('/access/:token', (req,res)=>{
        res.redirect('/')
    })

    app.get('/teest', (req, res)=>{
        res.download(`${__dirname}/../uservault/1508184486990.jpg`);
    })
}

