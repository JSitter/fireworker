module.exports = (app)=>{
    const User = require('../models/user.js')
    const Record = require('../models/record.js')
    const Transfer = require('../models/transfer')
    const jwt = require('jsonwebtoken')
    const fs = require('fs')
    const web_address = "http://127.0.0.1:8180"

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
            //save data for transfer record
            const owner_id = req.user
            const valid_time = +Date
            const record_ids = req.body
            let transfer
            let user

            //Create Security Token
            let token = jwt.sign({ owner_id, valid_time, record_ids }, process.env.SECRETKEY, { expiresIn: "60 days" })
            token = token.split('.')
            sec_token = token[2]

            t = new Transfer({owner_id, sec_token, valid_time})

            for(key in record_ids){
                t.records.unshift(key)
                t.save()
            }
            console.log("transfer sec token", t.sec_token)
            res.send( web_address + '/access/' + t.sec_token)

         }

     })

    /*********************************************
     *  /access/:token
     *      Access user's documents
     ********************************************/
    app.get('/access/:token', (req,res)=>{
        token = req.params.token
        console.log("token", token)
        Transfer.find({ sec_token: token}).populate('records').then((transfer)=>{

            // transfer.populate('records').then((t)=>{
            //     console.log("populated t", t)
            // })

            console.log("transfer sheet", transfer)
            console.log("transfer id", transfer._id)
            res.render('download', { record: transfer.records })
        }).catch((err)=>{
            console.log("error getting transfer sheet:", err.message)
        })

    })

    app.get('/dl-res/:id', (req, res)=>{
        Record.findById(req.params.id).then((record)=>{
            res.download(`${__dirname}/../uservault/${record.local_address}`)
        })
    })

    app.get('/teest', (req, res)=>{
        res.download(`${__dirname}/../uservault/1508184486990.jpg`);
    })
}

