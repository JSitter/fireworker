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
            res.send(token)
        });

    }

    app.post('/login', (req, res) => {
        /**
         * Required Parameters:
         *  req.body.email
         *  req.body.password
         * 
         * Optional params:
         *  req.body.consent
         */
    
        console.log('Attempted Login');

        User.findOne({email: req.body.email}, (err, user) => {
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
         *  req.body.email
         *  req.body.password1
         *  req.body.password2
         * 
         * Optional params:
         *  req.body.consent
         *  req.body.firstName
         *  req.body.lastName
         *  req.body.phone
         */
    
        console.log('Attempted Registration');
        let password = null;
        let email = null;
        let consent = null;//
        let firstName = null;//
        let lastName = null;//
        let phone = null;//

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
        try{
            email = req.body.email;
            if(req.body.password1 != req.body.password2){
                return res.status(406).send({message: "Passwords don't match"});
            }
            password = req.body.password1;
        }catch(err){
            res.status(406).send({message: "Email and password Required."});
        }
        try{
            consent = req.body.consent;

        }catch(err){
            console.log(err)
            consent = false;
        }

        User.find({email: email}, (err, user) => {
            if(user.length > 0){
                return res.status(409).send({message: "Email already exists."});
            }
            
            if(password.length < 4){
                return res.status(406).send({message: "Passwords must be longer than 3 characters."})
            }

            console.log("Creating new user account.");
            const acct = {
                firstName   :   firstName,
                lastName    :   lastName,
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

    app.get('/users', (req, res) => {
        User.find({}, function(err, users) {
            let userMap = {};

            users.forEach(function(user){
                userMap[user._id] = user;
            });

            return res.send(userMap);
        })
    });
}