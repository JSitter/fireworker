module.exports = (app)=>{
    User = require('../models/user.js')
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
}

