/*
 * GET home page.
 */

exports.create = function(req, res){
  res.render('poll/create', { title: "HackerCouncil"});
};

exports.add = function(req, res) {
  var poll = {
    title: req.body.title,
    description: req.body.description
  };
  pollDAO.insert(poll); // <<-- Come from global scope.
  res.render('poll/add', { title: "HackerCouncil", 
                           result: "Inserido com sucesso!"});
}

exports.remove = function(req, res){
  // TODO!
}

exports.list = function(req, res) {
  pollDAO.list(10,function(polls) {
    res.render('poll/list', {polls: polls});
  }); 
}
