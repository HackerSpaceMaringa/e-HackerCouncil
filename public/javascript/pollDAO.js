/*
 * PollDAO is responsable to manage polls in the database.
 */

exports.pollDAO = function(mongoose) {
  var pollSchema = new mongoose.Schema({
    title: String,
    author: String,
    situation: Number,
    comments: [{ body: String, author: String, date: Date }],
    description: String,
    date: { type: Date, default: Date.now },
    votes: [{ username: String, vote: Number }] // 0 - Negative
                                             // 1 - positive
                                             // 2 - Neutral
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
      if (err) return 
      console.dir(a);
      console.dir(comment);
    });
  }

  // Just push the vote in the poll
  function updateVote(conditions, update, options){
    poll.update(conditions, update, options, function(err,num) {
      if (err) return 
      console.dir(update)
    }); 
  }

  // Push a new vote to poll
  this.vote = function(a,newVote){
    var conditions = a,
        options = { upsert: true };
    
    // Check if has already voted
    poll.findOne(a, function(err, pollRes) {
      for( var i = 0; i < pollRes.votes.length; i++ ) {
        if ( pollRes.votes[i].username == newVote.username && 
                pollRes.votes[i].vote == newVote.vote ) {
          return
        }
        else if (pollRes.votes[i].username == newVote.username){
            var last = pollRes.votes.length - 1;
            var temp = pollRes.votes[last];
            pollRes.votes[last] = pollRes.votes[i];
            pollRes.votes[i] = temp;
            update = { $pop: {votes: last}}; //index to remove
            updateVote(conditions, update, options);
        }
      }
      update = { $push: {votes: newVote}},
      updateVote(conditions, update, options)
    });
  }

  // Update the situation of a poll
  this.situation = function(a,newSituation) {
    update = { $set: {situation:newSituation}},
    options = { upsert: true};
    poll.update(a, update, options, function(err, num){
        if (err) return console.error(err);
        console.dir(a);
        console.dir(newSituation);
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
