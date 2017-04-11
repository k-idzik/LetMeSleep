"use strict";

///Return the position of the mouse in the local coordinate system of an element
function getMouse(e) {
	var mouse = {} //Mouse object to return coordinates
    
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
    console.log("y:" + mouse.y);
	return mouse;
}

///Return whether or not the targeted area was clicked on
function clickedInsideSling(x, y, I) {
	var dx = x - I.x;
	var dy = y - I.y;
    
	return dx * dx + dy * dy <= I.radius * I.radius;
}

function clickedInsideStart(x, y, canvasWidth){
		//(this.canvas.width /2) - 100, 300, 200, 50
		//debugger;
		
		var xMAX = ((canvasWidth/2)+100);
		var xMin = ((canvasWidth/2) - 100);
		if( xMAX > x && x > xMin && 350>y && y>300){
			console.log("AA");
			return true;
		}
		else{
			return false;
		}
}