"use strict";

///Return the position of the mouse in the local coordinate system of an element
function getMouse(e) {
	var mouse = {} //Mouse object to return coordinates
    
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
    
	return mouse;
}

///Return whether or not the targeted area was clicked on
function clickedInsideSling(x, y, I) {
	var dx = x - I.x;
	var dy = y - I.y;
    
	return dx * dx + dy * dy <= I.radius * I.radius;
}