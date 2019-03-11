/**********************
 *  Fireworker
 *      User Model
 **********************/

var mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
Schema = mongoose.Schema;


/**********************
 *  Define User Schema
 **********************/
var UserSchema = new Schema({
    email           : { type: String, required: true},
    password        : { type: String, select: false },
    fname           : { type: String },
    lname           : { type: String },
    records         : [{ type: Schema.Types.ObjectId, ref: 'Record' }],
    pw_reset_request : { type: Date },
    pw_reset_token : { type: String },
    subscription: { type: Date }
});

/*************************
 *  SAVE USER
 *************************/
UserSchema.pre('save', function(next){
        
  // DONT ENCRYPT PASSWORD IF NOT CHANGED
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }

  //  GENERATE SALT
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});



/*************************
 *  Compare Password
 *************************/
  UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      done(err, isMatch);
    });
  };
  
  module.exports = mongoose.model('User', UserSchema);