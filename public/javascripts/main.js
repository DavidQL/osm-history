var osm = {
	init: function() {
		$('span.chooseDb select').on('change', function(e) {
			window.location.href = '/switch-to/' + $(this).val();
		});
	},
	map: function() {
		var lat = $('#map').data('lat');
		var lon = $('#map').data('lon');
		var map = L.map('map').setView([lat, lon], 10);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	}
};

window.osm = osm;

$(document).ready(function() {
	osm.init();
	if ($('#map').length) {
		osm.map();
	}
});