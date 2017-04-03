"use strict";

//Use the existing app if it does exist, otherwise make a new object literal
var app = app || {};

app.main = {  
    //Canvas
    canvas: undefined,
    ctx: undefined,
    animationID: 0,
    paused: false,
	gameOver: false,
    
    //Images
    sloth: undefined,
	slothHead: undefined,
    rockIMG: undefined,
        
    //Pause state
    paused: false,
    
    //Slingshot clickpoint
    clickpoint: {
        xPos: 0,
        yPos: 0,
        radius: 10
    },
	
	//Sloth Lives
	slothLives: 3,

    //Rocks
    rocks: [],
    ROCK: Object.seal({
        x:0,
        y:-10,
        RADIUS: 4,
        MIN_RADIUS: 2,
        MAX_RADIUS: 15,
        SPEED: 1,
        ROCK_ART: this.rock,
    }),
    rockCooldown: 100,
    rockTimer:0,
    maxRocks: 5, //Max rocks allowed at once

    ///Makes rocks
    makeRocks: function() {
        var Rock_Draw = function(ctx) {
            //draw rock to canvas
            ctx.save();

            ctx.strokeStyle = "black";
            ctx.fillStyle = "gray";

            ctx.beginPath();
            ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();


            ctx.restore();

            //console.log("rock draw" + this.x + " " + this.y);
        };

        var Rock_Update = function(appRef) {
            //make rock fall from the sky
            this.y += this.speed;

			//rock has hit sloth
            if(this.y > appRef.canvas.height-100){
                //remove from rocks array
                for(var i =0; i < appRef.rocks.length; i++) {
                    if(appRef.rocks[i] == this){
                        appRef.rocks.splice(i, 1);
						appRef.slothLives--;
                        break;
                    }
                }
            }
        };

        var Rock_CollisionDetection = function() {

        };

        var array = [];

        if(this.rocks.length == 0) {
            var r = {};

            r.x = Math.floor((Math.random()*this.canvas.width) + 1);
            r.y = -20;

            r.radius = this.ROCK.RADIUS;

            r.speed = this.ROCK.SPEED;

            r.draw = Rock_Draw;
            r.update = Rock_Update;

            Object.seal(r);
            this.rocks.push(r);
            this.rockTimer = 0;
        }
        else if(this.rockTimer > this.rockCooldown && this.rocks.length < this.maxRocks) {
            var r = {};

            r.x = Math.floor((Math.random()*this.canvas.width) + 1);
            r.y = -20;

            r.radius = this.ROCK.RADIUS;

            r.speed = this.ROCK.SPEED;

            r.draw = Rock_Draw;
            r.update = Rock_Update;

            Object.seal(r);
            this.rocks.push(r);

            this.rockTimer = 0;
        }
        else {
            this.rockTimer++;
        }
    },

    ///Initialization function
    init: function() {
        this.canvas = document.querySelector("canvas");
        this.ctx = canvas.getContext("2d");

        //Set the clickpoint coordinates
        this.clickpoint.xPos = this.canvas.width / 2;
        this.clickpoint.yPos = this.canvas.height - 120;
        
        //get sloth Image
        this.sloth = new Image();
        this.sloth.src = "art/SleepingSloth.png";
		
		this.slothHead = new Image();
		this.slothHead.src = "art/slothHead.png";

        this.makeRocks();
        
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
        
		if(!this.gameOver){
	        this.makeRocks();
	        
	        for(var i =0; i < this.rocks.length; i++) {
	            var r = this.rocks[i];
	
        	    r.update(this);
        	}
		}
		
		if(this.slothLives <=0){
			this.gameOver = true;
		}
		
        this.draw();
			
        console.dir(this.rocks);
        
        this.slingShot(this.ctx);
    },

    ///Everything related to drawing should happen here
    draw: function(){
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); //Clear the background

        //draws the sloth
        this.ctx.drawImage(this.sloth, 0,this.canvas.height-100, this.canvas.width, 100);

        for(var i =0; i < this.rocks.length; i++){
            var r = this.rocks[i];

            r.draw(this.ctx);
        }

		//DRAW HUD
		this.drawHUD(this.ctx);
		
		//if game is over
		if(this.gameOver){
			this.drawGameOverScreen(this.ctx);
		}
		
        //If the game is paused
        if (this.paused) {
            this.drawPauseScreen(this.ctx);
            return; //Skip the rest of the loop
        }
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

	//RESET GAME METHOD
	resetGame: function(){
		
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

	//draws HUD
	drawHUD: function(ctx){
		ctx.save();
		ctx.textAlign = "left";
        ctx.textBaseline = "top";
		ctx.font = "24pt Open Sans";
		ctx.fillStyle = 'black';
		ctx.fillText("LIVES:" ,0,0);
		
		for(var s =0; s< this.slothLives; s++){
			ctx.drawImage(this.slothHead,(s*50)+100,0, 50,50);
		}
		ctx.restore();
	},
	
	drawGameOverScreen: function(ctx){
		ctx.save(); //Save the current state of the canvas

        //Obscure the game
        ctx.globalAlpha = .5;
        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //Align the text on the screen
		ctx.globalAlpha = 1;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        //Draw text
        ctx.font = "40pt Open Sans";
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER", this.canvas.width/2, this.canvas.height/2-200);

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