
module.exports = (URI) => {

    const mongoose = require('mongoose');
    mongoose.connect(URI);
    //Use Javascript promise instead of mongodb
    mongoose.Promise = global.Promise;

    // log errors
    mongoose.connection.on('error', console.error.bind(console, "MongoDB connection error"));
    console.log("db connection established")

};
