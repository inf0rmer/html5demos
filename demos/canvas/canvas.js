(function() {
	
	// Get the canvas HTML element
	var canvas = document.getElementById('myCanvas'),
		// Get the canvas context, the object we can paint on.
		ctx = canvas.getContext('2d'),
		
		width = canvas.width,
		
		height = canvas.height,
		// Our data is static
		data = [10, 25, 35, 5, 15, 10],
		
		total = 100,
		
		// Control variable
		lastend = 0;
		
		// Clear the canvas
		ctx.clearRect(0, 0, width, height);
		
		// Loop through the data and render each piece
		for (var i=0, len=data.length; i<=len; i++) {
			var piece = data[i];
			
			// Sanity checks
			if (piece && typeof piece === 'number' && piece > 0) {
				// Generate a random hex color - http://paulirish.com/2009/random-hex-color-code-snippets/
				ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
				
				// Tell canvas to begin drawing
				ctx.beginPath()
				// Move the virtual pencil to the middle of our canvas
				ctx.moveTo(width/2, height/2)
				// Draw an arc: x position, y position, then startAngle and then endAngle. antiClockwise is false
				ctx.arc(width/2, height/2, height/2, lastend, lastend + (Math.PI*2*( piece / total )), false)
				// Draw a line back to the center
				ctx.lineTo(width/2, height/2)
				// Fill with color
				ctx.fill()
				
				// Add to the control variable the same amount of degrees we moved
				lastend += Math.PI*2*( piece / total)
			}
		}
		
		
}());