const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  Define Receipt
 */
var Receipt = new Schema({
    timestamp       :   { type: String },
    ip              :   { type: String },
    agent           :   { type: String },
});

module.exports = mongoose.model('Receipt', Receipt);