var osm = {
	init: function() {
		$('span.chooseDb select').on('change', function(e) {
			window.location.href = '/switch-to/' + $(this).val();
		});
	}
};

window.osm = osm;

$(document).ready(function() {
	osm.init();
});