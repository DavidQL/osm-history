var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes');
var users = require('./routes/user');
var d3 = require('./routes/d3');
var line_graph = require('./routes/line_graph');
var nodes = require('./routes/nodes');
var map = require('./routes/map');
var engine = require('ejs-locals');

var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// other setup
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// database
var db = require('./db/db_adapter')(app);

app.get('/', routes.index);
app.get('/users/:username/nodes', users.nodes);
app.get('/d3/:username', d3.d3);
app.get('/line_graph', line_graph.line_graph);
app.get('/nodes', nodes.index);
app.get('/nodes/metadata', nodes.metadata);
app.get('/map', map.index);
app.get('/switch-to/:db_name', db.switchDbs);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
