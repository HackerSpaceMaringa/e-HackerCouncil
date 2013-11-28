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
        return done(null, profile);
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
    $.get(req.user._json.organizations_url, function(data) {
        var memberLevel = 0;
        if (isFromHackerspace(data)){
            memberLevel = 1
        }
        var user = {
           name: req.user.displayName,
           username: req.user.username,
           email: req.user.emails[0].value,
           level: memberLevel
        };
        userDAO.dontExist(user,userDAO.insert);
        res.redirect('/polls');
    });
}

exports.logout = function(req, res) {
   req.logout();
   res.redirect('/polls');
}
