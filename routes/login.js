/*
 *  GET page
 */

// setting up passport
passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(user, done) {
   done(null, user);
});

// github strategy
var GIT_HUB_CLIENT_ID = "2d21240ababc64035ede"
var GIT_HUB_CLIENT_SECRET = "ba8de45333f38d8c989b2ad2521bb45527177266"
passport.use(new GitHubStrategy({
    clientID: GIT_HUB_CLIENT_ID,
    clientSecret: GIT_HUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        $.get(profile._json.organizations_url, function(data) {
            if (isFromHackerspace(data)){
                return done(null, profile);
            }
            else return done(null, null);
        });
    }
));

var organizationName = 'HackerSpaceMaringa';
function isFromHackerspace(organizations){
    for (var i = 0; i < organizations.length; i++){
        if (organizations[i].login == organizationName)
            return true;
    }
    return false;
}

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
