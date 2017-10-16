/*********************************
 *  Fireworker
 *      Record Model
 *********************************/

 const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const UserBinaryRecord = new Schema({
    local_address   : { type: String, required: true},
    owner_id      : { type: String},
    user_filename   : { type: String}
});

module.exports = mongoose.model('UserBinaryRecord', UserBinaryRecord);