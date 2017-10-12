module.exports = (app)=>{
    //Main landing page
    app.get('/', (req, res)=>{
        res.render("home")
    })

    app.get('/sign-up', (req, res)=>{
        res.render("sign-up")
    })
}

