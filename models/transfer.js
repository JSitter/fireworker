const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/****************************************************
 *  Define Transfer Schema
 ***************************************************/
var Transfer = new Schema({
    uid             : { type: Schema.Types.ObjectId, ref: 'User'},
    token           : { type: String },
    records         : [{ type: Schema.Types.ObjectId, ref: 'Record' }]
});

module.exports = mongoose.model('Transfer', Transfer);