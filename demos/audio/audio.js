// Use an auto-invoking function to avoid leakage into the global scope.
(function() {
	
	// Cache all the elements we will be using
	var audio = document.getElementsByTagName('audio')[0],
		playBtn = document.getElementById('play'),
		position = document.getElementById('position'),
		controls = document.getElementById('controls'),
		ready = false;
	
	// addEvent() can be found in assets/js/libs/utils.js, and is a simple cross-browser event handler. Here we're using it to play or pause the audio on click.
	
	addEvent(playBtn, 'click', function() {
		if (ready) {
			if (audio.paused) {
				if (audio.ended) {
					audio.currentTime = 0;
				}
				
				audio.play();
				this.innerHTML = 'Pause';
			} else {
				audio.pause();
				this.innerHTML = 'Play';
			}
		}
	});
	
	// The audio object triggers a "timepudate" event while it's playing, so we can listen to it to regularly update our custom time display.
	addEvent(audio, 'timeupdate', function() {
		position.innerHTML = convertToTime(this.currentTime);
	});
	
	// This event fires when the audio ends, and we're using it to restore the "Play" text to our button.
	addEvent(audio, 'ended', function() {
		playBtn.innerHTML = 'Play';
	});
	
	// readyState > 0 means that the metadata is loaded already - fire the event handler manually.
	if (audio.readyState > 0) {
		loadedmetadata.call(audio);
	} else {
	// Otherwise, listen for the loadedmetadata event coming from the audio to trigger the handler function
  		addEvent(audio, 'loadedmetadata', loadedmetadata);
	}
	
	
	// When this function is called it means the audio is ready for playing
	function loadedmetadata() {
		ready = true;
		document.getElementById('duration').innerHTML = convertToTime(this.duration);
	}
	
	// Helper functions
	
	// Converts time t in seconds (with decimal cases) to mm:ss
	function convertToTime(t) {
		t = Math.round(t);
		var s = t % 60;
		var m = Math.round(t / 60);
  
		return two(m) + ':' + two(s);
	}
	
	// Puts a zero behind the number if there's just one, to keep the mm:ss format, eg. 02:25 instead of 2:25
	function two(s) {
		s += "";
		if (s.length < 2) s = "0" + s;
		return s;
	}

	
}());