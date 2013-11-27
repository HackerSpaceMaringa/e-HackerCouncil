
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var poll = require('./routes/poll');
var login = require('./routes/login');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var pollDB = require('./public/javascript/pollDAO');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var $ = require('jquery');

var app = express();

// setting up passport
passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(user, done) {
   done(null, user);
});

// google strategy
passport.use(new GoogleStrategy({
      returnURL: 'http://localhost:3000/auth/google/return',
      realm: 'http://localhost:3000/'
   },
   function(identifier, profile, done) {
      process.nextTick(function() {
         profile.identifier = identifier;
         return done(null, profile);
      });
   }
));

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

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Start database connection
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    console.log('Conectado ao MongoDB.')
});

mongoose.connect('mongodb://localhost/test'); // <--- Database name here
pollDAO = new pollDB.pollDAO(mongoose);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/poll/add', ensureAuthenticated, poll.add);
app.get('/poll/comment/:id/', ensureAuthenticated, poll.comment);
app.get('/poll/remove/:id', ensureAuthenticated, poll.remove);
app.get('/polls', ensureAuthenticated, poll.list);

// login google
app.get('/auth/google',
      passport.authenticate('google', { failureRedirect: '/' }));
app.get('/auth/google/return',
      passport.authenticate('google', { failureRedirect: '/' }),
      login.logged);

// login github
app.get('/auth/github',
        passport.authenticate('github', { failureRedirect: '/'}));
app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/'}),
        login.logged);

app.get('/logout', login.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// always connected
function ensureAuthenticated(req, res, next) {
   if (req.isAuthenticated()) { return next(); }
   res.redirect('/');
}
