const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true, required: true, match: /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/ },
  email: { type: String , trim: true },
  postcode: { type: String, match: /[A-Z]{1,2}[0-9]{1,2}[A-Z]? [0-9][A-Z]{2}/},
  lat: { Number },
  lng: { Number },
  image: { type: String },
  password: { type: String, match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/ },
  githubId: { type: Number },
  facebookId: {type: Number }
});

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

// lifecycle hook - mongoose middleware
userSchema.pre('validate', function checkPassword(next) {
  if(!this.password && !this.githubId && !this.facebookId ) {
    this.invalidate('password', 'required');
  }
  if(this.password && this._passwordConfirmation !== this.password){
    this.invalidate('passwordConfirmation', 'does not match');
  }
  next();
});

userSchema.pre('save', function checkPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  if(!this.password) return false;
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre('remove', function removeUserPosts(next) {
  this.model('WildlifePost')
    .remove({ createdBy: this.id })
    .then(() => {
      return this.model('WildlifePost').update(
        { 'comments.createdBy': this.id }, // this is the query
        { $pull: { comments: { createdBy: this.id } } } // this is the update
      );
    })
    .then(next)
    .catch(next);
});

module.exports = mongoose.model('User', userSchema);
