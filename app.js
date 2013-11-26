
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var poll = require('./routes/poll')
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var pollDB = require('./public/javascript/pollDAO');

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
app.post('/poll/add', poll.add);
app.get('/poll/remove/:id', poll.remove);
app.get('/polls', poll.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
