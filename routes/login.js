/*
 *  GET page
 */

exports.login = function(req, res) {
   res.render('login');
}

exports.logged = function(req, res) {
   res.redirect('/');
}

exports.logout = function(req, res) {
   req.logout();
   res.redirect('/');
}
