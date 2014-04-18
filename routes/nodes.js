exports.index = function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	var username = req.query.username;
	var point = {
		type: "Point", 
		coordinates: [Number(lon), Number(lat)]
	};

	if (lat && lon) {
		req.db.Node.geoNear(point, {maxDistance: 0.5, spherical: true, num:5000, lean: true}, function(err, results, stats) {
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