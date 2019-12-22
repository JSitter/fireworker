const express = require('express');
const crypto = require('crypto');
const process = require('process');
const mongoose = require('mongoose');

const dburi = process.env.MONGODB_URI || 'mongodb://localhost:27017/fireworker';
const PORT = process.env.PORT || 8000

const createSecret = function () {
    return crypto.randomBytes(2048).toString('hex');
}

process.env.SECRETKEY = createSecret();

const app = express();

mongoose.connect(dburi);
//Use Javascript promise instead of mongodb
mongoose.Promise = global.Promise;

// log errors
mongoose.connection.on('error', console.error.bind(console, "MongoDB connection error"));

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(PORT, function(){
    console.log('Listening on port ', PORT);
});