/*
 * GET home page.
 */

exports.create = function(req, res){
  res.render('poll/create', { title: "HackerCouncil"});
};

exports.add = function(req, res){
  // TODO!
  var result = "Falha ao inserir petição!"
  res.render('poll/add', { title: "HackerCouncil", result: result});
}

exports.remove = function(req, res){
  // TODO!
}

exports.list = function(req, res){
  // TODO!
}
