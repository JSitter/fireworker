const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/****************************************************
 *  Define Transfer Schema
 ***************************************************/
var Transfer = new Schema({
    owner_id        : { type: Schema.Types.ObjectId, ref: 'User'},
    transfer_to     : { type: Schema.Types.ObjectId, ref: 'Contact'},
    sec_token       : { type: String },
    valid_time      : { type: String },
    records         : [{ type: String}]
});

module.exports = mongoose.model('Transfer', Transfer);