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
            var token = jwt.sign({ _id: user._id }, 'secretSAlt', { expiresIn: "60 days" });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            res.redirect('/');
        }).catch()
    })

    app.post('/login', (req, res)=>{
        console.log("finding user")
        User.findOne({ email: req.body.email }, "+password", function (err, user) {
            if (!user) { return res.status(401).send({ message: 'Wrong username or password' }) };
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (!isMatch) {
                return res.status(401).send({ message: 'Wrong Username or password' });
              }
        
              var token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
              res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        
              res.redirect('/u');
            });
          })
    })

    app.get('/u', (req, res)=>{
        res.render('user')
    })
}
