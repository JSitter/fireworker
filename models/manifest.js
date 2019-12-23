const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  Define Manifest
 */
var Manifest = new Schema({
    user_id         :   { type: Schema.Types.ObjectId, ref: 'User'},
    recipient_id    :   [{ type: Schema.Types.ObjectId, ref: 'User'}],
    token           :   { type: String },
    expire          :   { type: String },
    reciepts        :   [{ type: Schema.Types.ObjectId, ref: 'Receipt'}],
    documents       :   [{ type: Schema.Types.ObjectId, ref: 'Document'}],
});

module.exports = mongoose.model('Manifest', Manifest);