// Use an auto-invoking function to avoid leakage into the global scope.
(function() {
	
	// Cache all the elements we will be using
	var video = document.getElementsByTagName('video')[0],
		playBtn = document.getElementById('play'),
		position = document.getElementById('position'),
		controls = document.getElementById('controls'),
		ready = false,
		fullscreen = null;
	
	// addEvent() can be found in assets/js/libs/utils.js, and is a simple cross-browser event handler. Here we're using it to play or pause the video on click.
	
	addEvent(playBtn, 'click', function() {
		if (ready) {
			if (video.paused) {
				if (video.ended) {
					video.currentTime = 0;
				}
				
				video.play();
				this.innerHTML = 'Pause';
			} else {
				video.pause();
				this.innerHTML = 'Play';
			}
		}
	});
	
	// The video object triggers a "timepudate" event while it's playing, so we can listen to it to regularly update our custom time display.
	addEvent(video, 'timeupdate', function() {
		position.innerHTML = convertToTime(this.currentTime);
	});
	
	// This event fires when the video ends, and we're using it to restore the "Play" text to our button.
	addEvent(video, 'ended', function() {
		playBtn.innerHTML = 'Play';
	});
	
	// readyState > 0 means that the metadata is loaded already - fire the event handler manually.
	if (video.readyState > 0) {
		loadedmetadata.call(video);
	} else {
	// Otherwise, listen for the loadedmetadata event coming from the video to trigger the handler function
  		addEvent(video, 'loadedmetadata', loadedmetadata);
	}
	
	
	// When this function is called it means the video is ready for playing
	function loadedmetadata() {
		ready = true;
		document.getElementById('duration').innerHTML = convertToTime(this.duration);
		
		// webkitSupportsFullscreen is false while the video is loading, so we can only create it after the loadedmetadata event has fired.
		if (video.webkitSupportsFullscreen) {
			fullscreen = document.createElement('button');
			fullscreen.className = 'btn';
			fullscreen.innerHTML = 'Fullscreen';
			
			controls.insertBefore(fullscreen, controls.firstChild);
			
			addEvent(fullscreen, 'click', function () {
				video.webkitEnterFullScreen();
			});
		}
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