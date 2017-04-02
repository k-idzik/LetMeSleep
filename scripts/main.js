"use strict";

//Use the existing app if it does exist, otherwise make a new object literal
var app = app || {};

app.main = {  
    //Canvas
    canvas: undefined,
    ctx: undefined,
    animationID: 0,
    
    //Pause state
    paused: false,
    
    //Slingshot clickpoint
    clickpoint: {
        xPos: 0,
        yPos: 0,
        radius: 10
    },

    ///Initialization function
    init: function() {
        this.canvas = document.querySelector("canvas");
        this.ctx = canvas.getContext("2d");
        
        //Set the clickpoint coordinates
        this.clickpoint.xPos = this.canvas.width / 2;
        this.clickpoint.yPos = this.canvas.height - 120;
        
        this.update(); //Start the animation loop
    },

    ///Update, runs the game
    update: function() {
        //Update the animation frame 60 times a second, binding it to call itself
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        //Draw the background
        this.ctx.fillStyle = "lightblue";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        //If the game is paused
        if (this.paused) {
            this.drawPauseScreen(this.ctx);
            return; //Skip the rest of the loop
        }
        
        this.slingShot(this.ctx);
    },
    
    ///This function will pause the game
    pauseGame: function() {
        this.paused = true;      
        cancelAnimationFrame(this.animationID); //Stop the animation loop
        this.update(); //Updates the screen once so that the pause screen is shown
    },
    
    ///This function will resume the game after pause
    resumeGame: function() {
        cancelAnimationFrame(this.animationID); //Stop the animation loop in case it's running
        this.paused = false;
        this.update(); //Restart the loop
    },
    
    ///This function will draw the pause screen
    drawPauseScreen: function(ctx) {
        ctx.save(); //Save the current state of the canvas
        
        //TODO: Update later with menu options
        
        //Obscure the game
        ctx.globalAlpha = .75;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        //Align the text on the screen
        ctx.translate(this.canvas.width / 2, this.canvas.height / 4);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        //Draw text
        ctx.font = "40pt Open Sans";
        ctx.fillStyle = "white";
        ctx.fillText("PAUSED", 0, 0);
        
        ctx.restore(); //Restore the canvas state to what it was before drawing the pause screen
    },
    
    ///Draw and utilize the slingshot
    slingShot: function(ctx) {
        //Draw the slingshot
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#8B4513";
        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2, this.canvas.height);
        ctx.lineTo(this.canvas.width / 2, this.canvas.height - 70);
        ctx.lineTo(this.canvas.width / 2.6, this.canvas.height - 120);
        ctx.moveTo(this.canvas.width / 2, this.canvas.height - 70);
        ctx.lineTo(this.canvas.width - (this.canvas.width / 2.6), this.canvas.height - 120);
        ctx.stroke();
        
        //Draw the slingshot's curved component
        ctx.lineWidth = 5;
        ctx.strokeStyle = "grey";
        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2.6, this.canvas.height - 120);
        ctx.quadraticCurveTo(this.canvas.width / 2, this.canvas.height - 120, this.canvas.width - (this.canvas.width / 2.6), this.canvas.height - 120);
        ctx.stroke();
        
        //Draw the slingshot's click point
        ctx.fillStyle = "dimgrey";
        ctx.beginPath();
        ctx.arc(this.clickpoint.xPos, this.clickpoint.yPos, this.clickpoint.radius, 0, Math.PI * 2);
        ctx.fill();
    }
};