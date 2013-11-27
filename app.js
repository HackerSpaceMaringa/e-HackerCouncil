
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
var userDB = require('./public/javascript/userDAO');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

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

// Init DAOs
pollDAO = new pollDB.pollDAO(mongoose);
userDAO = new userDB.userDAO(mongoose);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Polls
app.get('/', routes.index);
app.post('/poll/add', ensureAuthenticated, poll.add);
app.get('/poll/comment/:id/', ensureAuthenticated, poll.comment);
app.get('/poll/remove/:id', ensureAuthenticated, poll.remove);
app.get('/polls', ensureAuthenticated, poll.list);

// login
app.get('/auth/google',
      passport.authenticate('google', { failureRedirect: '/' }));
app.get('/auth/google/return',
      passport.authenticate('google', { failureRedirect: '/' }),
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
