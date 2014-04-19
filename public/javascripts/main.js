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
			// this.fetchNodes(lat, lon, map);
		},
		createNewMap: function(map) {
			var lat = $('#map').data('lat');
			var lon = $('#map').data('lon');
			var map = L.map('map', {
				markerZoomAnimation: false
			}).setView([lat, lon], 6);

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
		},

		fetchMetaData: function(lat, lon, map) {
			$.get('/nodes/metadata', function(result) {
				var firstDay = moment(result.earliest);
				var lastDay = moment(result.latest);
				var cursorDay = moment(result.earliest);
				var monthsCount = lastDay.diff(firstDay, 'months');
				// debugger
				$('#calendar').datepicker({
					numberOfMonths: 3,
					defaultDate: firstDay.toDate(),
					onSelect: function(dateText, inst) {
						var date = moment(dateText).valueOf();
						// TODO update URL with date param
						osm.map.fetchNodes(lat, lon, map, date);
					}
				});

				if (osm.map.getURLParameter('date')) {
					(function() {
						var date = Number(osm.map.getURLParameter('date'));
						osm.map.fetchNodes(lat, lon, map, date);
						// TODO select day on calendar
						console.log('setting date')
						$('#calendar').datepicker("setDate", moment(date).toDate());
					})();

				}
			});
		},
		getURLParameter: function(name) {
		    return decodeURI(
		        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		    );
		},
		fetchNodes: function(lat, lon, map, date) { // date optional
			date || (date = osm.map.getURLParameter('date'));
			$.get('/nodes?lat=' + lat + '&lon=' + lon + (date ? '&date=' + date : '')).done(function(results) {
				var $map = $('#map');
				$map.clone().empty().insertAfter('#map');
				$map.remove();
				(function() {
					var lat = $('#map').data('lat');
					var lon = $('#map').data('lon');
					var map = L.map('map', {
						markerZoomAnimation: false
					}).setView([lat, lon], 6);

					L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					}).addTo(map);

					$('.results-count').text(results.length);
					var markers = new L.MarkerClusterGroup();
					window.markers = markers;


					_.each(results, function(point, i) {
						markers.addLayer(new L.marker([point.obj.properties.lat, point.obj.properties.lon], {
							icon: L.icon({
								iconUrl: '/images/marker-icon.png',
							    shadowUrl: '/images/marker-shadow.png'
							})
						}));
					});
					map.addLayer(markers);
				})();

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