module.exports = (app) => {
    const User = require('../models/user.js');
    const Session = require('../models/session.js');
    const jwt = require('jsonwebtoken');
    const fs = require('fs');

    app.post('/api/user', (req, res) => {
        

    });

    app.post('/api/user/new', (req, res) => {

    });
}