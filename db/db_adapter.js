var mongoose = require('mongoose');
var node_schema = require('./node_schema');
var config = require('./config');
var connection, db;

mongoose.connect(config.db.url + '/' + config.db.defaultDbName);

connection = mongoose.connection;

db = {
	mongoose: mongoose,
	connection: connection,
	schemas: {
		node: node_schema
	},
	allDbs: config.db.allDbs
};

db.switchDbs = function(req, res) {
  mongoose.disconnect(function() {
    mongoose.connect(config.db.url + '/' + req.params.db_name);
    req.session.currentDb = req.params.db_name;
    res.redirect(req.get('referer'));
  });
};

db.Node = db.mongoose.model('Node', db.mongoose.Schema(db.schemas.node));

db.connection.on('error', console.error.bind(console, 'connection error:'));

module.exports = function(app) {
	app.all('*', function(request, response, next) {
	  // initial setup
	  request.db = db;
	  request.db.defaultDbName = config.db.defaultDbName;
	  response.config = {
	  	currentDb: request.session.currentDb || request.db.defaultDbName,
	  	allDbs: request.db.allDbs
	  };
	  next();
	});
	return db;
}
