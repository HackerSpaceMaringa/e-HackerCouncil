/*
 * PollDAO is responsable to manage polls in the database.
 */

exports.pollDAO = function(mongoose) {
  var pollSchema = new mongoose.Schema({
    id: Number,
    title: { type: String },
    description: String,
    date: Number,
  });

  var poll = mongoose.model('poll', pollSchema);

  // Insert a poll in DB. Expecting a to be a poll object.
  this.insert = function(a) {
    var newPoll = new poll(a);
    newPoll.save(function(err, newPoll){
      if (err) return console.error(err);
      console.dir(newPoll);
    });
  }

  // Remove a poll with the same ID; 
  this.remove = function(id) {
    //TODO
  }

  // List the last n polls createds.
  // n = number of polls to list. */
  this.list = function(n) {
    //TODO
  }
}
