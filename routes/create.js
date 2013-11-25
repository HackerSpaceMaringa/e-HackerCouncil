
/*
 * GET home page.
 */

exports.create = function(req, res){
  res.render('create', { title: "HackerCouncil"});
};

exports.add = function(req, res){
  // TODO!
  var result = "Falha ao inserir petição!"
  res.render('add', { title: "HackerCouncil", result: result});
}
