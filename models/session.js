const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  Define Session
 */
var Session = new Schema({
    userId         :   { type: Schema.Types.ObjectId, ref: 'User'},
    token           :   { type: String },
    valid           :   { type: Boolean },
    expire          :   { type: String },
});

module.exports = mongoose.model('Session', Session);