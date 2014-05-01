var _ = require('underscore');

exports.index = function(req, res){
	var lat = req.query.lat;
	var lon = req.query.lon;
	var date = req.query.date;
	var username = req.query.username;

	res.render('map', _.extend(res.config, { 
		lat: lat,
		lon: lon,
		date: date,
		username: username
	}));
};