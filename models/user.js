var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  // facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String,
  //   username: String,
  // },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
});


var User = mongoose.model('User', userSchema);
module.exports = User;
