var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');

var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var redis   = require("redis");
var redisStore = require('connect-redis')(session);
var client  = redis.createClient();

var expressValidator = require('express-validator');

var routes = require('./index');
const config = require('./config/redis')
var configDB = require('./config/database.js');

mongoose.Promise = require('bluebird');
mongoose.connect(configDB.produrl,{
  useMongoClient : true
});
var db = mongoose.connection;
db.on('error',console.error.bind(console,'Error in connection'));


var app = express();

// call socket.io to the app
app.io = require('socket.io')();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(expressValidator({
  customValidators: {
    isGreater: (value1, value2) => {
      return value1 > value2
    },
    isDate: (value1)=> {
      return !isNaN(Date.parse(value1));
    }
  }
}));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: config.redisStore.secret,
// create new redis store.
store: new redisStore({ host: config.redisStore.host, port: config.redisStore.post, client: client}),
saveUninitialized: false,
resave: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// pass passport for configuration
require('./config/passport')(passport);

app.use('/', routes);



app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

// start listen with socket.io
app.io.on('connection', function(socket){  
  console.log('a user connected');
  socket.on('NewroomAdded',function(){
      console.log('user entered');
    app.io.emit('AddRow',{});
   // socket.join(params.roomName);

});
socket.on('JoinGame',function(params){
  socket.join(params.room.toString());
  console.log('A user from ' + socket.conn.remoteAddress + ' has connected to room ' + params.room);
  var clients = app.io.sockets.adapter.rooms[params.room.toString()];
  
  if(clients.length >1)
    app.io.in(params.room.toString()).emit('startgame', 'cool game');

})
socket.on('Submit',function(params){
  app.use('/result',routes);
})
});

module.exports = app;
