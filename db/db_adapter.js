var _ = require('underscore');
var mongoose = require('mongoose');
var node_schema = require('./node_schema');
var config = require('./config');
var connections = {}, db;

_.each(config.db.allDbs, function(dbName) {
  connections[dbName] = mongoose.createConnection(config.db.url + '/' + dbName)
  connections[dbName].Node = connections[dbName].model('Node', mongoose.Schema(node_schema));
});

db = {
	switchDbs: function(req, res) {
    req.session.currentDb = req.params.db_name;
    res.redirect(req.get('referer'));   
  }
};

module.exports = function(app) {
	app.all('*', function(request, response, next) {
	  // initial setup
    request.db = connections[request.session.currentDb || config.db.defaultDbName];
    request.db.defaultDbName = config.db.defaultDbName;

	  response.config = {
	  	currentDb: request.session.currentDb || request.db.defaultDbName,
	  	allDbs: config.db.allDbs
	  };
	  next();
	});
	return db;
}
