var _ = require('underscore');

exports.index = function(req, res){
	var lat = req.query.lat;
	var lon = req.query.lon;
	var nodes = req.db.Node.geoNear({type: "Point", coordinates: [lat, lon]}, {maxDistance: 5, spherical: true}, function(err, results, stats) {
		console.log(err, results, stats);
	})
	res.render('map', _.extend(res.config, { 
		lat: lat,
		lon: lon
	}));
};