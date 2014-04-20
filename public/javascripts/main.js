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
			osm.map.toggleLoader("Fetching date distribution");
			this.fetchMetaData(lat, lon, map).done(function() {
				osm.map.toggleLoader();
				// if date in URL, fetch that immediately
				if (osm.map.getURLParameter('date')) {
					(function() {
						var date = Number(osm.map.getURLParameter('date'));
						osm.map.fetchNodes(lat, lon, map, date);
						$('#calendar').datepicker("setDate", moment(date).toDate());
					})();
				}
			});
		},
		createNewMap: function() {
			var lat = $('#map').data('lat');
			var lon = $('#map').data('lon');
			var map = L.map('map', {
				markerZoomAnimation: false
			}).setView([lat, lon], 12);

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
			return map;
		},

		fetchMetaData: function(lat, lon, map) {
			return $.get('/nodes/metadata', function(result) {
				var firstDay = moment(result.earliest);

				$('#calendar').datepicker({
					numberOfMonths: 2,
					defaultDate: firstDay.toDate(),
					onSelect: function(dateText, inst) {
						var date = moment(dateText).valueOf();
						osm.map.fetchNodes(lat, lon, map, date);
					}
				});
			});
		},
		getURLParameter: function(name) {
		    return decodeURI(
		        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		    );
		},
		resetMap: function() {
			var $map = $('#map');
			$map.clone().empty().insertAfter('#map');
			$map.remove();
		},
		fetchNodes: function(lat, lon, map, date) { // date optional
			date || (date = osm.map.getURLParameter('date'));
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

			results = _.sortBy(results, function(point) {
				return point.obj.properties.timestamp;
			});

			map.addLayer(markers);

			(function() {
				var i = 0;
				var myInterval = setInterval(function() {

					if (i >= results.length) {
						clearInterval(myInterval);
						return;
					}

					var point = results[i];

					// every 100th, update the time display
					if (i % 100 === 0 || ((results.length - i) < 100)) {
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
			$('.results-count .count').text(count);
			if (date) {
				$('.results-count .date').text(' for ' + moment(date).format("dddd, MMMM Do YYYY"));
			}
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