exports.index = function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	var point = {
		type: "Point", 
		coordinates: [Number(lon), Number(lat)]
	};
	var nodes = req.db.Node.geoNear(point, {maxDistance: 0.5, spherical: true, num:5000}, function(err, results, stats) {
		console.log(stats)
		res.send(results);
	});
};