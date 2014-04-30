var osm = {
	init: function() {
		
	},
	map: {
		init: function() {
			var lat = $('#map').data('lat');
			var lon = $('#map').data('lon');
			var map = osm.map.createNewMap();
			var date = $('#map').data('date');
			
			osm.map.fetchNodes(lat, lon, map, date);

			$('#datepicker').datepicker({
				numberOfMonths: 1,
				defaultDate: moment.utc(date).toDate(),
				onSelect: function(dateText, inst) {
					var date = moment.utc(dateText).valueOf();
					window.location.href = "?lat="+lat+"&lon="+lon+"&date=" + date;
				}
			});
			$('#datepicker').val(moment.utc(date).format("MM/DD/YYYY"));

			// on replay
			$('.playback-options button').on('click', function() {
				var map;
				$('.playback-options').fadeOut(500);
				osm.map.resetMap();
				map = osm.map.createNewMap();
				osm.map.printMetadata(osm.map.results.length, date);
				osm.map.layMarkers(osm.map.results, map);
			});

			// on re-fetch
			$('.playback-options p a').on('click', function(e) {
				$('.playback-options').fadeOut(500);
				if (osm.map.center) {
					osm.map.fetchNodes(osm.map.center[0], osm.map.center[1], map, date, osm.map.zoom);
				} else {
					osm.map.fetchNodes(lat, lon, map, date, osm.map.zoom);
				}
				
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
			$('.users').empty();
		},
		fetchNodes: function(lat, lon, map, date, zoom) {
			var url = '/nodes?lat=' + lat + '&lon=' + lon + '&date=' + date;
			osm.map.toggleLoader('Fetching nodes');
			zoom && (url += '&zoom=' + zoom);
			$.get(url).done(function(results) {
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
			var total_results = results.length;
			osm.map.results = results;
			results = _.sortBy(results, function(point) {
				return point.obj.properties.timestamp;
			});

			map.addLayer(markers);

			(_.bind(function() {
				var i = 0;
				var markerInterval = setInterval(_.bind(function() {
					var point;

					if (i >= results.length) {
						clearInterval(markerInterval);
						$('.playback-options').fadeIn(500);
						return;
					}

					point = results[i];

					// every 100th, update the time display
					if (i % 10 === 0 || ((results.length - i) < 10)) {
						$('.time').text(moment.utc(point.obj.properties.timestamp).format("hh:mm A"))
					}

					this.updateUserTotals(point, total_results);
					
					markers.addLayer(new L.marker([point.obj.properties.lat, point.obj.properties.lon], {
						icon: L.icon({
							iconUrl: '/images/marker-icon.png',
						    shadowUrl: '/images/marker-shadow.png'
						})
					}));

					i = i + 1;
				}, this), 10);
			}, this))();
		},
		updateUserTotals: function(point, total_results) {
			var $user = $('.users div[data-user="'+point.obj.properties.user+'"');
			var new_count;
			var $newUsers;
			var markup;

			if ($user.length) {
				new_count = $user.data('count') + 1;
				$user.find('span.count').text(new_count);
				$user.find('span.bar').css('width', ((new_count/total_results) * 100) + "%")
				$user.attr('data-count', new_count);
			} else {
				markup = _.template($('#userTemplate').html(), {
					name: point.obj.properties.user,
					count: 1
				}, {
					interpolate : /\{\{(.+?)\}\}/g
				});
				$user = $(markup);
				$user.find('span.bar').css('width', ((new_count/total_results) * 100) + "%");
				$('.users').append($user);
			}

			$newUsers = _.sortBy($('.users > div'), function($el) {
				return -1 * $($el).data('count');
			});
			$('.users').empty().append($newUsers);
		},
		printMetadata: function(count, date) {
			$('.results-count').show();
			$('.results-count .count').text(count === 5000 ? '> 5000' : count);
			$('.results-count .date').text(moment.utc(date).format("dddd, MMMM Do YYYY"));
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