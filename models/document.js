const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  Define Document
 */
var Document = new Schema({
    user_id         :   { type: Schema.Types.ObjectId, ref: 'User'},
    filePath        :   { type: String },
    fileName        :   { type: String },
    MIME            :   { type: String },
    encrypted       :   { type: Boolean },
});

module.exports = mongoose.model('Document', Document);
