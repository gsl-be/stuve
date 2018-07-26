var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
var viewfolder = path.join(__dirname, 'views')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Uncomment to external folders for routing
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

////////////////////////most of your code is in this section /////////

/* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: viewfolder});
});


////////////////////////////start the server/////////////////////
var port=3000
app.listen(port, function(){
    console.log('App listening on port:' + port)
})
