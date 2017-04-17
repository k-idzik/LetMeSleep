"use strict";

var app = app || {};

app.Keys = function(){
	var keys = {};
	
	keys.keydown = [];
	debugger;
	
	//Key down event listener
	window.addEventListener("keydown", function(e){
		
		console.log("Key Down: " + e.keyCode);
		keys.keydown[e.keyCode] = true;
	});
	
	//key up event listener
	window.addEventListener("keyup", function(e){
		console.log("KeyUp: " + e.keyCode);
		keys.keydown[e.keyCode] = false;
	});
	
	return keys;
}()
