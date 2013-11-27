/*
 *  GET page
 */

exports.logged = function(req, res) {
   var user = {
      name: req.user.displayName,
      email: req.user.emails[0].value,
      level: 0
   };
   userDAO.dontExist(user,userDAO.insert);
   res.redirect('/polls');
}

exports.logout = function(req, res) {
   req.logout();
   res.redirect('/polls');
}
