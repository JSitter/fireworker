module.exports = (app) => {
    const User = require('../models/user.js');
    const Session = require('../models/session.js');
    const jwt = require('jsonwebtoken');
    const crypto = require('crypto');

    const createToken = function(length){
        return crypto.randomBytes(length).toString('hex');
    }

    const loginUser = function(req, res, user){
        const expiry = new Date(Date.now() + 12096e5);
        const token = jwt.sign({ _id: user._id }, process.env.SECRETKEY, {expiresIn: expiry.getTime()});
        if(req.body.consent){
            res.cookie('fToken', token, { maxAge: 604800000, httpOnly: true });
        }
        console.log("setting user session");
        Session.findOneAndDelete({userId : user._id}, function(err, session){
            const newSess = new Session({userId : user._id, token: token, valid: true, expire: expiry.getTime()})
            newSess.save();
            res.send({fToken:token})
        });

    }

    app.post('/login/', (req, res) => {
        /**
         * Required Parameters:
         *  req.body.userName
         *  req.body.password
         * 
         * Optional params:
         *  req.body.consent
         */
    
        console.log('Attempted Login');

        User.findOne({userName: req.body.userName}, (err, user) => {
            if(!user){ return res.status(401).send({ message: 'wrong username or password'})}

            user.comparePassword(req.body.password, function(err, match){
                if(err){
                    console.log(err);
                }
                if( !match ) {
                    return res.status(401).send({message: 'Wrong username or password.'});
                }
                //set cookie if user requests
                loginUser(req, res, user);

            })
        });
    });

    app.post('/register/', (req, res) => {
        /**
         * Required Parameters:
         *  req.body.username
         *  req.body.password1
         *  req.body.password2
         * 
         * Optional params:
         *  req.body.email
         *  req.body.consent
         *  req.body.firstName
         *  req.body.lastName
         *  req.body.phone
         */
    
        console.log('Attempted Registration');
        let password = null;
        let userName = null;
        let consent = null;//
        let firstName = null;//
        let lastName = null;//
        let phone = null;//
        let email = null;

        // Don't crash the server when setting values...
        try {
            firstName = res.body.firstName
        } catch(err) {
            // silence
        }
        try {
            lastName = res.body.lastName
        } catch(err){
            // silence
        }
        try {
            phone = res.body.phone
        } catch(err) {
            // silence
        }

        try {
            email = req.body.email
        } catch( err ){
            // silence
        }
        try{
            userName = req.body.userName;
            if(req.body.password1 != req.body.password2){
                return res.status(406).send({message: "Passwords don't match"});
            }
            password = req.body.password1;
            if (password.length < 7){
                return res.status(411).send({message: "Password not long enough"});
            }
        }catch(err){
            return res.status(406).send({message: "userName and password Required."});
        }
        try{
            if(req.body.consent === true){
                consent = true;
            }else  {
                consent = false;
            }

        }catch(err){
            console.log(err)
            consent = false;
        }

        User.find({userName: userName}, (err, user) => {
            if(user.length > 0){
                return res.status(409).send({message: "userName already exists."});
            }

            if(password.length < 4){
                return res.status(411).send({message: "Passwords must be longer than 6 characters."})
            }

            console.log("Creating new user account.");
            const acct = {
                firstName   :   firstName,
                lastName    :   lastName,
                userName    :   userName,
                email       :   email,
                phone       :   phone,
                password    :   password,
                consent     :   consent,
            }
            
            const newUser = new User(acct);
            newUser.save().then((user)=>{
                //set cookie if user requests
                loginUser(req, res, user);
            })
        });
    });

    app.get('/users/', (req, res) => {
        User.find({}, function(err, users) {
            let userMap = {};

            users.forEach(function(user){
                userMap[user._id] = user;
            });

            return res.send(userMap);
        })
    });

    app.get('/find/:userName', (req, res)=>{
        let uName;
        try{
            uName = req.params.userName
        }catch(err){
            res.status(400).send({message: "Username not provided"});
        }
        User.find({userName: uName}).then(user=>{
            user.length > 0 ? res.send({found:true}) : res.send({found:false});
        });
    });

    app.get('/self-destruct/sitter/pi/one/one/zero/', (req, res)=>{
        // Destroy all User database contents
        User.remove({}, ()=>{
        console.log("Tears are for children")
        res.send({message: "Tears are for children."});
        });
    })
}
