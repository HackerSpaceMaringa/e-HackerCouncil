/*
 * PollDAO is responsable to manage polls in the database.
 */

exports.userDAO = function(mongoose) {
  var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    level: Number,
  });

  var user = mongoose.model('user', userSchema);

  // Insert a poll in DB. Expecting a to be a poll object.
  this.insert = function(a) {
    var newUser = new user(a);
    newUser.save(function(err, newPoll){
      if (err) return console.error(err);
      console.dir(newPoll);
    });
  }

  // Execute callback if user don't exist
  this.dontExist = function(userData, callback){
    user.find({email: userData.email},function (err, userRes){
      if (err)   return
      if (userRes) return
      callback(userData)
    });
  }

  // Remove a poll with the same ID; 
  this.remove = function(a) {
    user.remove(a, function(err, result) {
      if (err) return console.error(err);
      console.dir(a);
      console.dir(result);
    });
  }
}