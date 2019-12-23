const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  Define Contact
 */
var Contact = new Schema({
    user_id         : { type: Schema.Types.ObjectId, ref: 'User'},
    firstName   :   { type: String },
    lastName    :   { type: String },
    email       :   { type: String },
    phone       :   { type: String },
});

module.exports = mongoose.model('Contact', Contact);