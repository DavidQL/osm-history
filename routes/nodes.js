exports.index = function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	var point = {
		type: "Point", 
		coordinates: [Number(lon), Number(lat)]
	};
	var nodes = req.db.Node.geoNear(point, {maxDistance: 1, spherical: true, num:200}, function(err, results, stats) {
		console.log(stats)
		res.send(results);
	});
};