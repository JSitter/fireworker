const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/****************************************************
 *  Define Transfer Schema
 ***************************************************/
var Contact = new Schema({
    owner_id             : { type: Schema.Types.ObjectId, ref: 'User'},
    token           : { type: String },
    records         : [{ type: Schema.Types.ObjectId, ref: 'Record' }]
});

module.exports = mongoose.model('Contact', Contact);