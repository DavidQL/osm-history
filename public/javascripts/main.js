var osm = {
	init: function() {
		$('span.chooseDb select').on('change', function(e) {
			window.location.href = '/switch-to/' + $(this).val();
		});
	},
	map: {
		init: function() {
			var lat = $('#map').data('lat');
			var lon = $('#map').data('lon');
			var map = L.map('map', {
				markerZoomAnimation: false
			}).setView([lat, lon], 6);

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			this.fetchMetaData(lat, lon, map);
			this.fetchNodes(lat, lon, map);
		},
		fetchMetaData: function(lat, lon, map) {
			$.get('/nodes/metadata', function(result) {
				var firstDay = moment(result.earliest);
				var lastDay = moment(result.latest);
				var cursorDay = moment(result.earliest);
				var monthsCount = lastDay.diff(firstDay, 'months');
				// debugger
				$('#calendar').datepicker({
					numberOfMonths: monthsCount,
					defaultDate: firstDay.toDate()
				});
			});
		},
		fetchNodes: function(lat, lon, map) {
			$.get('/nodes?lat=' + lat + '&lon=' + lon).done(function(results) {
				var markers = new L.MarkerClusterGroup();

				_.each(results, function(point, i) {
					markers.addLayer(new L.marker([point.obj.properties.lat, point.obj.properties.lon], {
						icon: L.icon({
							iconUrl: '/images/marker-icon.png',
						    shadowUrl: '/images/marker-shadow.png'
						})
					}));
				});
				map.addLayer(markers);
			});
		},
	}
};

window.osm = osm;

$(document).ready(function() {
	osm.init();
	if ($('#map').length) {
		osm.map.init();
	}
});