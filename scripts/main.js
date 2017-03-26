(function ()
{
    "use strict";
    window.onload = init; //Call init when the window loads

    //Canvas
    var canvas; //The canvas
    var ctx; //Canvas context

    //Initialization function
    function init()
    {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");
        
        update(); //Start the animation loop
    }

    //Update audio visualizer
    function update()
    {
        canvas.width = document.body.clientWidth; //Dynamically adjust the size of the canvas
        requestAnimationFrame(update); //Update the animation frame 60 times a second

    }
}());