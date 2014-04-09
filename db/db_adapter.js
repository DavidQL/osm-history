var mongoose = require('mongoose');
var node_schema = require('./node_schema');
var connection, db;

mongoose.connect('mongodb://epic-analytics.cs.colorado.edu:27018/denver_boulder');

connection = mongoose.connection;

db = {
	mongoose: mongoose,
	connection: connection,
	schemas: {
		node: node_schema
	}
};

db.Node = db.mongoose.model('Node', db.mongoose.Schema(db.schemas.node));

db.connection.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;