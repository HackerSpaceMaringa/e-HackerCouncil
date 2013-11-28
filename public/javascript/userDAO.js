/*
 * PollDAO is responsable to manage polls in the database.
 */

exports.userDAO = function(mongoose) {
  var userSchema = new mongoose.Schema({
    name: String,
    username: String,
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
    this.search(userData, function(userRes){
      if (userRes != null) return
      callback(userData);
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

  // Find one instance of userData by his/her username
  this.search = function(userData, callback){
    user.findOne({username: userData.username}, function(err, userRes) {
      if (err) console.error(err);
      callback(userRes);
    });
  }

  // Check if user is a hackerspace member
  this.isMember = function(user, callback){
    this.search(user, function(userRes){
      if (userRes.level == 1) callback();
    });
  }
}
