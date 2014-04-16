var osm = {
	init: function() {
		$('span.chooseDb select').on('change', function(e) {
			window.location.href = '/switch-to/' + $(this).val();
		});
	},
	map: function() {
		var lat = $('#map').data('lat');
		var lon = $('#map').data('lon');
		var map = L.map('map', {
			markerZoomAnimation: false
		}).setView([lat, lon], 6);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		$.get('/nodes?lat=' + lat + '&lon=' + lon).done(function(results) {
			_.each(results, function(point, i) {
				L.marker([point.obj.properties.lat, point.obj.properties.lon], {
					icon: L.icon({
						iconUrl: '/images/marker-icon.png',
					    shadowUrl: '/images/marker-shadow.png'
					})
				}).addTo(map);
			});
		});
	}
};

window.osm = osm;

$(document).ready(function() {
	osm.init();
	if ($('#map').length) {
		osm.map();
	}
});