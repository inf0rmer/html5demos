// Use an auto-invoking function to avoid leakage into the global scope.
(function() {
	
	// Cache elements that we're going to use
	var controls = document.querySelectorAll('#controls button'),
		textArea = document.getElementById('editable');
	
	// Add a click event to every control.
	addEvent(controls, 'click', function() {
		// The name of the command is this.id
		var command = this.id,
			// the execCommand API takes an optional argument for some actions that require it. We set it to null and override when needed.
			optionalValue = null;
		
		// Special rules for createLink, since we need to pass an URL as the optional argument
		if (command === 'createLink') {
			// Use a simple window.prompt() to ask the user for a value.
			optionalValue = window.prompt('Add a URL for this link');
			
			// If the user doesn't input anything, bail out. We should check for a proper url with a RegExp, but you can consider that as homework.
			if (!optionalValue) return false;
		}
		
		// The execCommand API applies a command to the currently selected text. You can view a list of all possible commands here:
		// https://developer.mozilla.org/en/Rich-Text_Editing_in_Mozilla#Executing_Commands
		document.execCommand(command, false, optionalValue);
		
		// Store the edited text in sessionStorage
		storeEditedText(textArea.innerHTML);
	});
	
	// These functions deal with storing and retrieving text using sessionStorage. Please refer to the Storage demo for more info.
	function storeEditedText(text) {
		if (window.sessionStorage) {
			window.sessionStorage.setItem('editedText', text);
		}
	}
	
	function getEditedText() {
		var text;
		
		if (window.sessionStorage) {
			text = window.sessionStorage.getItem('editedText');
			
			if (text) {
				textArea.innerHTML = text;
			}
		}
	}
	
	getEditedText();
	
}());