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
			var map = osm.map.createNewMap();
			var date = $('#map').data('date');
			
			osm.map.fetchNodes(lat, lon, map, date);

			$('#calendar').datepicker({
				numberOfMonths: 1,
				defaultDate: moment(date).toDate(),
				onSelect: function(dateText, inst) {
					var date = moment(dateText).valueOf();
					window.location.href = "?lat="+lat+"&lon="+lon+"&date=" + date;
				}
			});

			$('.playback-options button').on('click', function() {
				var map;
				$('.playback-options').fadeOut(500);
				osm.map.resetMap();
				map = osm.map.createNewMap();
				osm.map.printMetadata(osm.map.results.length, date);
				osm.map.layMarkers(osm.map.results, map);
			});
		},
		createNewMap: function() {
			var lat = $('#map').data('lat');
			var lon = $('#map').data('lon');

			var map = L.map('map', {
				markerZoomAnimation: false
			}).setView(osm.map.center || [lat, lon], osm.map.zoom || 12);

			var updateMapData = function(e) {
				osm.map.center = [map.getCenter().lat, map.getCenter().lng];
				osm.map.zoom = map.getZoom();
			};

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			map.on('viewreset', updateMapData);
			map.on('moveend', updateMapData);

			return map;
		},
		resetMap: function() {
			var $map = $('#map');
			$map.clone().empty().insertAfter('#map');
			$map.remove();
		},
		fetchNodes: function(lat, lon, map, date) {
			osm.map.toggleLoader('Fetching nodes')
			$.get('/nodes?lat=' + lat + '&lon=' + lon + (date ? '&date=' + date : '')).done(function(results) {
				var map;
				
				osm.map.toggleLoader();
				osm.map.resetMap();

				map = osm.map.createNewMap();

				osm.map.printMetadata(results.length, date);
				
				osm.map.layMarkers(results, map);
			});
		},
		layMarkers: function(results, map) {
			var markers = new L.MarkerClusterGroup();
			osm.map.results = results;
			results = _.sortBy(results, function(point) {
				return point.obj.properties.timestamp;
			});

			map.addLayer(markers);

			(function() {
				var i = 0;
				var markerInterval = setInterval(function() {
					var point;

					if (i >= results.length) {
						clearInterval(markerInterval);
						$('.playback-options').fadeIn(500);
						return;
					}

					point = results[i];

					// every 100th, update the time display
					if (i % 10 === 0 || ((results.length - i) < 10)) {
						$('.time').text(moment(point.obj.properties.timestamp).format("hh:mm a"))
					}
					
					markers.addLayer(new L.marker([point.obj.properties.lat, point.obj.properties.lon], {
						icon: L.icon({
							iconUrl: '/images/marker-icon.png',
						    shadowUrl: '/images/marker-shadow.png'
						})
					}));

					i = i + 1;
				}, 10);
			})();
		},
		printMetadata: function(count, date) {
			$('.results-count').show();
			$('.results-count .count').text(count === 5000 ? '> 5000' : count);
			$('.results-count .date').text(moment(date).format("dddd, MMMM Do YYYY"));
		},
		toggleLoader: function(message) {
			if (message) {
				$('.loader').show().find('span').text(message);
				return;
			}
			$('.loader').hide();
		}
	}
};

window.osm = osm;

$(document).ready(function() {
	osm.init();
	if ($('#map').length) {
		osm.map.init();
	}
});