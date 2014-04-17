exports.index = function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	var username = req.query.username;
	var point = {
		type: "Point", 
		coordinates: [Number(lon), Number(lat)]
	};

	if (lat && lon) {
		req.db.Node.geoNear(point, {maxDistance: 0.5, spherical: true, num:50000}, function(err, results, stats) {
			console.log(stats)
			res.send(results);
		});	
	}

	if (username) {
		req.db.Node.find({'properties.user': username}).limit(200).exec(function(err, node) {
			res.send(node);
		});
	}

};

exports.metadata = function(req, res) {
	var nodes = req.db.Node.find().sort()
}