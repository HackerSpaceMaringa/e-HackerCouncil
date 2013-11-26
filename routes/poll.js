/*
 * GET home page.
 */

exports.add = function(req, res) {
  var poll = {
    title: req.body.title,
    description: req.body.description
  };
  pollDAO.insert(poll); // <<-- Come from global scope.
  res.redirect('polls');
}

exports.remove = function(req, res) {
  var poll = {                                                                  
    _id: req.param('id')
  }; 
  pollDAO.remove(poll);
  res.redirect('polls');
}

exports.vote = function(req,res) {
  
}

exports.comment = function(req,res) {
  var poll = {
    _id: req.param('id')
  };
  var comment = {
    body: req.param('commentBody'),
    date: Date.now()
  }
  pollDAO.comment(poll,comment);
  res.redirect('polls');
}

exports.list = function(req, res) {
  pollDAO.list(10,function(polls) {
    res.render('polls', {polls: polls});
  }); 
}
