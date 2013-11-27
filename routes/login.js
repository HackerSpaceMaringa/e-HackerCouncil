/*
 *  GET page
 */

exports.logged = function(req, res) {
   res.redirect('/polls');
}

exports.logout = function(req, res) {
   req.logout();
   res.redirect('/polls');
}
