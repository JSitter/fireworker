/*********************************
 *  Fireworker
 *      User Model
 *********************************/

var mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
Schema = mongoose.Schema;

/****************************************************
 *  Define User Schema
 ***************************************************/
var UserSchema = new Schema({
    email           : { type: String, required: true},
    password        : { type: String, select: false },
    firstname       : { type: String },
    lastname        : { type: String }
});

/****************************************************
 *  SAVE USER
 ***************************************************/
UserSchema.pre('save', function(next){
    
        // SET createdAt AND updatedAt
        var now = new Date();
        this.updatedAt = now;
        if ( !this.createdAt ) {
          this.createdAt = now;
        }
      
        // ENCRYPT PASSWORD
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

/****************************************************
 *  Compare Password
 ***************************************************/
  UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      done(err, isMatch);
    });
  };
  
  module.exports = mongoose.model('User', UserSchema);