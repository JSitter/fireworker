const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var pwReset = new Schema({
    ipAddress: { type: String },
    token : { type: String },
    timestamp : { type: Date }
});

module.exports = mongoose.model('Contact', Contact);