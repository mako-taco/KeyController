(function() {
	/*
	new KeyController([
			{
				hotkey: "ctrl/cmd shift 3",
				fn: function(e) {
					...
				}
			}, 
			{
				hotkey: "alt r",
				fn: function(e) {
					...
				}	
			}
		]
	])
	*/
	var KeyController = function(bindings) {
		if(!Array.isArray(bindings)) {
			console.error("new KeyController expects [Array], got", arguments)
			throw "BAD_PARAMS";
		}

		for(i in bindings) {
			var hotkey = bindings[i].hotkey.toUpperCase(),
				split = hotkey.split(/\s+/g),
				keys = split.pop().split('/'),
				special = KeyController.special,
				mods = KeyController.mods,
				expressions = [],
				fnString = "";

			/*Turns a hotkey string like "alt ctrl/cmd shift a" into 
				function(e) {
					return (e.altKey) &&
						(e.ctrlKey || e.metaKey) &&
						String.fromCharCode(e.keyCode) == 65;
				}
			*/
			fnString = "return " + split.map(function(s) {
					return "(" + s.split('/').map(function(a) {
						return "e." + mods[a]
					}).reduce(function(a, b) {
						return a + " || " + b;
					}) + ")"
				}).reduce(function(a, b) {
					return a + " && " + b;
				}) + " && (";

			fnString += keys.map(function(k) {
				return special.hasOwnProperty(k) 
					? "e.keyCode == " + special[k]
					: "String.fromCharCode(e.keyCode) == '" + k + "'";
			}).reduce(function(a, b) {
				return a + " || " + b
			}) + ");";
		

			bindings[i].matches = new Function("e", fnString);
		}
		this.bindings = bindings;
		this.active = false;

		KeyController.controllers.push(this);
	}

	KeyController.prototype.activate = function(deactivateOthers) {
		if(!!deactivateOthers) {
			for(i in controllers) {
				controllers[i].active = false;
			}
		}

		this.active = true;
	} 

	KeyController.prototype.deactivate = function() {
		this.active = false;
	}

	KeyController.controllers = [];
	KeyController.special = {
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		PAUSE: 19,
		BREAK: 19,
		CAPSLOCK: 20,
		ESC: 27,
		SPACE: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		PRNTSCRN: 44,
		INSERT: 45,
		DELETE: 46
	};
	KeyController.mods = {
		SHIFT: 'shiftKey',
		CTRL: 'ctrlKey',
		META: 'metaKey',
		CMD: 'metaKey',
		ALT: 'altKey'
	};


	KeyController.listener = function(e) {
		var controllers = KeyController.controllers;
		for(var i=0, l=controllers.length; i<l; i++) {
			var controller = controllers[i];
			if(!controller.active) {
				continue;
			}
			else {
				var bindings = controller.bindings;
				for(var j=0, m=bindings.length; j<m; j++) {
					var binding = bindings[j];
					if(binding.matches(e)) {
						binding.fn(e);
					}
				}
			}
		}
	}

	document.addEventListener('keydown', KeyController.listener);
	window.KeyController = KeyController;
})();
