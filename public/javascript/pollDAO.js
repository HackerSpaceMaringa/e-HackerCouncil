/*
 * PollDAO is responsable to manage polls in the database.
 */

exports.pollDAO = function(mongoose) {
  var pollSchema = new mongoose.Schema({
    title: String,
    author: String,
    comments: [{ body: String, date: Date }],
    description: String,
    date: { type: Date, default: Date.now },
    votes: {
          aprove: Number,
          reprove: Number,
          neutral: Number
    }
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
  this.remove = function(a) {
    poll.remove(a, function(err, result) {
      if (err) return console.error(err);
      console.dir(a);
      console.dir(result);
    });
  }

  // Push a comment in the poll that fits with a.
  this.comment = function(a,comment) {
    var conditions = a, 
    update = { $push: {comments:comment}},
    options = { upsert: true };
    poll.update(conditions, update, options, function(err, num) {
      if (err) return console.error(err);
      console.dir(a);
      console.dir(comment);
    });
  }

  // List the last n polls createds.
  // n = number of polls to list. */
  this.list = function(n,callback) {
    poll.find({}).sort({date: -1}).limit(n).exec(function(err,polls){
      callback(polls);
    });
  }
}
