var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');   

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(cookieParser('Quiz 2015'));
app.use(session());
//en el parametro _method viene el metodo http que vamos a utilizar
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});


//Control sesión expirada
app.use(function(req, res, next) {
    if(req.session.user){// hay sesión 
        if(!req.session.lastAccess){
            //guardamos en session el tiempo actual
            req.session.lastAccess=(new Date()).getTime();
        }else{
            //controlamos si nos pasamos de 2 minutos de inactividad (120000 milisegundos)
            if((new Date()).getTime()-req.session.lastAccess > 120000){
                //sesión expirada, borramos usuario de la sesión
                delete req.session.user;
                delete req.session.lastAccess;
                //redirigimos a login
                res.render('sessions/new', {errors: [{"message": "Sesión caducada, vuelva a acceder"}]});

            }else{
                //actualizamos ultimo acceso session
                req.session.lastAccess=(new Date()).getTime();              
            }
        }
    }
    next();
});


app.use('/', routes);

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
