var express = require('express')
, path = require('path')
, favicon = require('serve-favicon')
, logger = require('morgan')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, mongoose = require('mongoose')
, serialport = require("serialport")
, routes = require('./routes/index')
, users = require('./routes/users')
, SerialPort = serialport.SerialPort
, app = express()
, serialport = require("serialport")
, SerialPort = serialport.SerialPort
, mySerial = new SerialPort("/dev/ttyACM0", {
  baudrate : 9600,
  parser : serialport.parsers.readline("\n")
});

mySerial.on("open", function(){
  console.log("Arduino: Conexão ok!");
});

//Conexão com Banco de dados
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sematec', function(err){
  // mongoose.connect('', function(err){
  if( err ) {
    console.log("Error conectar mongo db: " + err);
  } else {
    console.log("Mongodb: Conexao realizada com sucesso!");
  }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	  console.log('Mongodb: Conexao realizada!');
});
//Esquema mongoose
var Schema = mongoose.Schema;
var Sniffi = new Schema({
  buffer: String,
});

// Mongoose Model definition
var Snif = mongoose.model('Sniffing', Sniffi);
//Pegando o dados da Serial
mySerial.on("data", function(data){
  var sniffi = new Snif();
  sniffi.buffer = data;
  sniffi.save(function(err,snifi){
    if(err){
      console.log(err);
    }
  })
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
  Snif.find(function(err,sniffi){
    res.json(sniffi);
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
