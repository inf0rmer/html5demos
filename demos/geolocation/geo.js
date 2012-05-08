// Use an auto-invoking function to avoid leakage into the global scope.
(function() {
	
	// This is a simple demo, no need to load jQuery: just use querySelectorAll
	var status = document.querySelectorAll('.alert')[0];
	
	
	// This function is used when geolocation succeeds.
	function success(position) {
		
		// Change our status DOM element
		status.innerHTML = 'There you are!';
		status.className = 'alert alert-success';
		
		// Create the map canvas div programmatically.
		var mapcanvas = document.createElement('div');
		mapcanvas.id = 'mapcanvas';
		// The height is the window height minus the status element's height and its margin-bottom value.
		mapcanvas.style.height = (window.innerHeight - status.offsetHeight - 18) + 'px';
		mapcanvas.style.width = window.innerWidth + 'px';
		
		// Append the map canvas element
		document.getElementsByTagName('body')[0].appendChild(mapcanvas);
		
		// Translate the coordinates given by the browser to the Google Maps format
		var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
		// Options object for Google Maps, check their API for more.
		var options = {
			zoom: 15,
			center: latlng,
			mapTypeControl: false,
			navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		// Create the Google Maps map
		var map = new google.maps.Map(document.getElementById('mapcanvas'), options);
		
		// Create the marker, its position being the same the browser detected
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: 'You should be here (within a ' + position.coords.accuracy + ' meter radius)'
		});
	}
	
	// This function runs if geolocation fails
	function error(msg) {
		// Update the status DOM object with the error message
		status.innerHTML = typeof msg === 'string' ? msg : 'Failed!';
		status.className = 'alert alert-error';
	}
	
	// Try to use geolocation, if unsupported display an error message.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		error('Geolocation is not supported in this browser.');
	}

}());