/*********************************
 *  Fireworker
 *      Record Model
 *********************************/

 const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const User = require('./user.js')

const Record = new Schema({
    local_address   : { type: String, required: true},
    owner_id        : { type: Schema.Types.ObjectId, ref:'User'},
    user_filename   : { type: String}
});

module.exports = mongoose.model('UserBinaryRecord', Record);