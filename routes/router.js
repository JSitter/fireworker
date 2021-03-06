module.exports = (app)=>{
    
    const User = require('../models/user.js')
    const Record = require('../models/record.js')
    const Transfer = require('../models/transfer')
    const jwt = require('jsonwebtoken')
    const fs = require('fs')
    const site_address = process.env.SITE || "http://localhost:"+ port


/******************************
 *  Main landing page
 ******************************/
    app.get('/', (req, res)=>{
        res.render("home")
    })

/*****************************
 *  User Signup
 *****************************/
    app.get('/sign-up', (req, res)=>{
        res.render("sign-up")
    })

/***************************
 *  Retrieve Post signup data
 ***************************/
    app.post('/signup', (req, res)=>{
        
        //Check if user email already exists
        User.find({email: req.body.email}, (err, acct)=>{
            console.log("User found: " + String(acct.length))
            if( acct.length > 0 ){
                //Redirect to login if user email already exists
                //In the future this should redirect to a reset password page
                res.redirect('/login')
            }else{
                console.log("New Acct Made")
            }
        })
        const user = new User(req.body);
        user.save().then((user)=>{
            //console.log(user);
            // Encode JWT and set cookie
            var token = jwt.sign({ _id: user._id }, process.env.SECRETKEY, { expiresIn: "60 days" });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            res.redirect('/u');
        }).catch()
    })

/****************************
 *  User Login
 ****************************/
    app.post('/login', (req, res)=>{

        console.log("finding user")

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

/***************************
 *  User home page
 ***************************/
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

/****************************
 * Logout User
 ****************************/
    app.get('/logout', (req, res)=>{
        res.clearCookie('nToken');
        res.redirect('/');
    })

/****************************
 *  Login redirect
 ***************************/
    app.get('/login', (req, res)=>{
        res.clearCookie('nToken');
        res.redirect('/');
    });

/**************************
 *  Save User Document
 **************************/
    app.get('/upload', (req, res)=>{
        if(!req.user){
            res.redirect('/login');
        }else{
            res.render('offer-document');
        }
    })

/**************************
 *  Handle User Record Submissionn via Post
 *************************/
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
            console.log(userFile)
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

    /**************************
     *      Gets (via POST) ids of docs to make available
     *      and returns link to retrieve them
     **************************/
     app.post('/tokenate', (req, res)=>{

         if(!req.user){
             //User Cookie Invalid
             res.send("Unable to authenticate.")
         }else{
            //save data for transfer record
            const owner_id = req.user
            const valid_time = +Date
            const record_ids = req.body
            const redeemed = false

            //Create Security Token
            let token = jwt.sign({ owner_id, valid_time, record_ids }, process.env.SECRETKEY, { expiresIn: "60 days" })
            token = token.split('.')
            sec_token = token[2]

            t = new Transfer({owner_id, sec_token, valid_time, redeemed})

            for(key in record_ids){
                t.records.unshift(key)
                t.save()
            }

            res.send( site_address + '/access/' + t.sec_token)

         }

     })

     /****************************
     *  User home page
     *****************************/
     app.get('/delete/:token/', (req, res)=>{
        if(!req.user){
            res.redirect('/');
        }else{

        }
     })

    /***************************
     *      Access user's documents
     ***************************/
    app.get('/access/:token', (req,res)=>{
        token = req.params.token

        Transfer.find({ sec_token: token})
        .populate({path:'records'}).then((transfers)=>{
            if(transfers.length == 0 || transfers[0].redeemed){
                //shady deals - redirect to home page
                return res.redirect('/expired-link')
            }
            //set transfer document as redeemed
            transfers[0].redeemed = true
            transfers[0].save()
            //set security token for document download
            var downloadToken = jwt.sign({ transfer_token : transfers[0].sec_token }, process.env.SECRETKEY)
            res.cookie('downloadAuth', downloadToken, { maxAge: 900000, httpOnly: true });
            // console.log("transfer sheet", transfers)
            // console.log("transfer id", transfers[0]._id)
            // console.log(transfers[0].records);
            res.render('download', { record: transfers[0].records })
        }).catch((err)=>{
            console.log("error getting transfer document:", err.message)
        })

    })

    /**************************
     *      download resource
     **************************/
    app.get('/dl-res/:id', (req, res)=>{

        if(typeof req.cookies.downloadAuth === 'undefined'){
            res.render('expired')
        }else{

            const client_token = jwt.verify(req.cookies.downloadAuth, process.env.SECRETKEY)

            Transfer.find({sec_token:client_token.transfer_token}).populate('records').then((item)=>{
                let found = false
                item[0].records.forEach((record)=>{
                    filename = record.user_filename
                    //Only download item if it's in transfer sheet
                    if(record._id == req.params.id){
                        res.download(`${__dirname}/../uservault/${record.local_address}`, filename)
                        found = true
                    }
                })
                if(!found){
                    res.render('expired')
                }

            }).catch((err)=>{
                console.log(err.message)
            })
        }

    })

/****************************
 *     Expired Resource
 ****************************/
    app.get('/expired-link', (req, res)=>{
        res.render('expired')
    })

}
