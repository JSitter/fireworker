const mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
Schema = mongoose.Schema;

/**
 *  Define User
 */
var UserSchema = new Schema({
    firstName       :   { type: String },
    lastName        :   { type: String },
    email           :   { type: String },
    verified        :   { type: Boolean },
    phone           :   { type: String },
    password        :   { type: String },
    resetToken      :   { type: String },
    resetRequest    :   { type: String },
    planAmt         :   { type: String },
    billingDate     :   { type: String },
    consent         :   { type: Boolean },
});

/*
 *  SAVE USER
 */
UserSchema.pre('save', function(next){
    console.log("Creating User");
    // DONT ENCRYPT PASSWORD IF NOT CHANGED
    var user = this;
    if (!user.isModified('password')) {
      return next();
    }

    //  GENERATE SALT
    bcrypt.genSalt(10, function(err, salt) {
      if(err){
          return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
      });
    });
  });
  

  
  
  
/*
  *  Compare Password
  */
  UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
      if(err){
        return done(err)
      }
      done(null, isMatch);
    });
  };
    
module.exports = mongoose.model('User', UserSchema);