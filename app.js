
/*
 * Copyright (c) 2013 HackerSpace Maringá
 * This software is under The MIT License.
 *
 * Developers:
 *  João Almeida de Jesus Jr.   <joao29a@gmail.com>
 *  Marcos Yukio Siraichi       <sir.yukio@gmail.com>
 *  Vanderson M. do Rosario     <vandersonmr2@gmail.com>
 *
*/

var express = require('express');
passport = require('passport');
GitHubStrategy = require('passport-github').Strategy;
$ = require('jquery');
email = require('nodemailer');
var routes = require('./routes');
var poll = require('./routes/poll');
var login = require('./routes/login');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var pollDB = require('./public/javascript/pollDAO');
var userDB = require('./public/javascript/userDAO');
var count = require('./public/javascript/countDown');
var sendEmail = require('./public/javascript/mail');

var app = express();


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
app.get('/poll/vote/:id/:vote', ensureAuthenticated, poll.vote);
app.get('/polls', ensureAuthenticated, poll.list);


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

count.doEveryMidNight(function pollExceeded() {
   console.log('Start verifying');
    pollDAO.list(10, function callback(polls) {
        var maxTime = 7*24*3600; //one week in seconds
        actualDate = new Date().getTime() / 1000;
        for (var i = 0; i < polls.length; i++){
            pollDate = polls[i].date.getTime() / 1000;
            totalTime = actualDate - pollDate;
            if (totalTime > maxTime){
               console.log('Sending to all');
               sendEmail.sendToUsers(polls[i]);
                pollDAO.situation(polls[i], 1);
            }
        }
    });
});
