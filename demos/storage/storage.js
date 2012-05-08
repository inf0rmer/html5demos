// Use an auto-invoking function to avoid leakage into the global scope.
(function() {
	
	// Cache commonly used elements
	var sessionEl = document.getElementById('session'),
		localEl = document.getElementById('local'),
		clearEl = document.getElementById('clear');
	
	// Since localStorage and sessionStorage have similar APIs, we can use the same function for both
	function getStorage(which) {
		// "localStorage" and "sessionStorage" are properties of the global scope
		var storage = window[which + 'Storage'],
			// use this for the "time ago" message
			delta = 0,
			// element that we'll be adding later with storage info
			li = document.createElement('li');
		
		// Bail out of the function if storage type is undefined - meaning it's probably unsupported in this client.
		if (!storage) return;
		
		// Storage works using key-value pairs. "getItem('key')" returns the value associated with that key
		if (storage.getItem('value')) {
			// Calculate time ago
			delta = ((new Date()).getTime() - (new Date()).setTime(storage.getItem('timestamp'))) / 1000;
			
			// Print the actual value combined with the time ago
			li.innerHTML = which + ' Storage: ' + storage.getItem('value') + ' (last updated: ' + delta + 's ago)';
		} else {
			li.innerHTML = which + ' Storage is empty';
		}
		
		// Append our newly created li element
		document.getElementById('previous').appendChild(li);
	}
	
	// call getStorage for localStorage and sessionStorage
	getStorage('local');
	getStorage('session');
	
	// Use keyup events to save values into storage
	addEvent(sessionEl, 'keyup', function() {
		// setItem() works similarly to getItem(). After saying which key we want to save under, pass in the value
		sessionStorage.setItem('value', this.value);
		sessionStorage.setItem('timestamp', (new Date()).getTime());
	});
	
	addEvent(localEl, 'keyup', function() {
		localStorage.setItem('value', this.value);
		localStorage.setItem('timestamp', (new Date()).getTime());
	});
	
	addEvent(clearEl, 'click', function() {
		// Clearing storage is as easy as calling clear()
		sessionStorage.clear();
		localStorage.clear();
		
		document.getElementById('previous').innerHTML = '';
		getStorage('local');
		getStorage('session');
	});

}());