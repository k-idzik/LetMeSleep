"use strict";

//Use the existing app if it does exist, otherwise make a new object literal
var app = app || {};

app.main = {  
    //Canvas
    canvas: undefined,
    ctx: undefined,
    animationID: 0,

    //Initialization function
    init: function() {
        this.canvas = document.querySelector("canvas");
        this.ctx = canvas.getContext("2d");
        
        this.update(); //Start the animation loop
    },

    //Update
    update: function() {
        //Update the animation frame 60 times a second, binding it to call itself
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(0, 0, 150, 150);
    }
};