(function() {
	
	// Get the canvas HTML element
	var canvas = document.getElementById('myCanvas'),
		// Get the canvas context, the object we can paint on.
		ctx = canvas.getContext('2d'),
		width = canvas.width,
		height = canvas.height;
		
	// Shiv for requestAnimationFrame(). We'll be using this instead of a normal setInterval for our animation loop.
	window.requestAnimFrame = (function(callback){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	// Our main draw function
	function draw() {
		// variables necessary for an eliptical orbit that varies with time
		var time = new Date().getTime() * 0.002,
			x = Math.sin( time ) * 96 + 128,
			y = Math.cos( time * 0.9 ) * 96 + 128;
			
			// Paint a small circle
			ctx.fillStyle = 'rgb(0,90,220)';
			ctx.beginPath();
			ctx.arc( x, y, 1, 0, Math.PI * 2, true );
			ctx.closePath();
			ctx.fill();
	}
	
	// Clear the canvas
	function clear() {
		ctx.clearRect(0, 0, width, height);
	}
	
	// Our animate loop calls draw() and requests to be executed again when the browser has a chance to animate again.
	function animate() {
		requestAnimFrame( animate );
		draw();
	}
	
	// clear our canvas once in a while
	setInterval(clear, 32*1000);
    
    // call animate() for the first time
    animate();
	
		
}());