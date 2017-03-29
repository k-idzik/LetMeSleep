"use strict";

var app = app || {};

app.main = {
    
    //Canvas
    canvas: undefined,
    ctx: undefined,

    //Initialization function
    init: function() {
        canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        
        update(); //Start the animation loop
    },

    //Update
    update: function() {
        //canvas.width = document.body.clientWidth; //Dynamically adjust the size of the canvas
        requestAnimationFrame(update); //Update the animation frame 60 times a second
        ctx.fillRect(0, 0, 150, 150);
    }
};