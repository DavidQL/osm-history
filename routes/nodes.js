var moment = require('moment');
var _ = require('underscore');

exports.index = function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	var username = req.query.username;
	var date = req.query.date && parseInt(req.query.date, 10);
	var end_date = req.query.end_date && parseInt(req.query.end_date, 10);
	var maxDistance = req.query.zoom && ((360/(Math.pow(2,req.query.zoom)))*Math.PI)/180;
	var point = {
		type: "Point", 
		coordinates: [Number(lon), Number(lat)]
	};
	var query;

	if (lat && lon) {
		if (date) {
			if (username && username !== 'undefined') {
				query = {
					"properties.timestamp": {
						"$gte": moment.utc(date).valueOf(), 
						"$lt": moment.utc(date).endOf('day').valueOf()
					},
					"properties.user": username					
				}
			} else {
				query = {
					"properties.timestamp": {
						"$gte": moment.utc(date).valueOf(), 
						"$lt": moment.utc(date).endOf('day').valueOf()
					}						
				}
			}
			return req.db.Node.geoNear(point, {
				maxDistance: maxDistance || 0.00056222641, spherical: true, num:5000, lean: true, 
				query: query
			}, function(err, results, stats) {
				console.log('date stats', stats)
				res.send(results);
			});

		}
	}

	if (username) 
	{
		if (date && end_date)
		{
			req.db.Node.find({'properties.user': username, 
							  'properties.timestamp' : {
							  	"$gte": moment.utc(date).valueOf(),
								"$lte": moment.utc(end_date).valueOf()
							}

							}).limit(20000).exec(function(err, node) {
								res.send(node);
							});
		}
		else 
		{
			req.db.Node.find({'properties.user': username}).limit(10000).exec(function(err, node) {
				res.send(node);
			});
		}
	}

};

exports.metadata = function(req, res) {
	var nodes = req.db.Node.find().sort({'properties.timestamp': 1}).limit(1).exec(function(err, results) {
		var earliest_date = results[0].properties.timestamp;
		req.db.Node.find().sort({'properties.timestamp': -1}).limit(1).exec(function(err, results) {
			var latest_date = results[0].properties.timestamp;
			res.send({
				earliest: earliest_date,
				latest: latest_date
			});
		});
	});
}