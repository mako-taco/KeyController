KeyController
=============

A utility for controlling groups of key bindings when creating web applications. Create multiple KeyControllers, each containing one to many actual key binding handlers.
Bindings will only fire when their KeyController is active.
```javascript
mode1 = new KeyController([
			{
				//Alt+R
				hotkey: "alt r",
				fn: function(e) {
					...
				}	
			},
			{
				//Ctrl+Shift+3 OR Cmd+Shift 3
				hotkey: "ctrl/cmd shift 3",
				fn: function(e) {
					...
				}
			}, 
			{
				//Delete OR Backspace
				hotkey: "DELETE/BACKSPACE",
				fn: function(e) {
					...
				}
			}
		]
	])

	mode1.activate();
```

Basic hotkeys
-------------
Make a basic hotkey by appening 0-many modifiers to a key, separated by spaces.
```
ctrl a
cmd shift alt d
```

Conditional hotkeys
-------------------
You can create more advanced hotkeys by adding slashes to modifiers or keys to indicate 'or'.  For example,
```
cmd/ctrl a
```
would fire on either Cmd+A or Ctrl+A.  Similarly,
```
shift a/b/c
```
would fire on either Shift+A, Shift+B, or Shift+C.

Managing Multiple KeyControllers
--------------------------------
By default, calling `activate` on a KeyController will deactivate all other KeyControllers first. If you would like
to prevent this behavior, you can pass the parameter `true` to `activate`.
```
var mode1 = new KeyController([
  {
    hotkey: "ctrl/cmd c",
    fn: function(e){
      console.log("Copy");
    }
  },
    hotkey: "ctrl/cmd v",
    fn: function(e) {
      console.log("Paste");
    }
  }
]);

var mode2 = new KeyController([
  {
    hotkey: "ctrl/cmd x",
    fn: function(e) {
      console.log("Cut");
    }
  }
]);

mode1.activate();
mode2.activate(true);
```
This will result in all three key bindings being registered at once.

Special Keys
------------
Special keys can be found on the KeyController object, and are as follows:
```
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
```
