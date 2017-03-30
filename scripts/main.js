	"use strict";
	
	//var Sloth image
	var sloth;
	var rock;

	//Use the existing app if it does exist, otherwise make a new object literal
	var app = app || {};
	
	app.main = {  
		//Canvas
		canvas: undefined,
		ctx: undefined,
		animationID: 0,
		paused: false,
		rocks: [],
		ROCK: Object.seal({
			x:0,
			y:-10,
			RADIUS: 4,
			MIN_RADIUS: 2,
			MAX_RADIUS: 15,
			SPEED: 5,
			ROCK_ART: rock,
		}),
		
		makeRocks: function(num){
			var Rock_Draw = function(ctx){
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
				
				console.log("rock draw" + this.x + " " + this.y);
			};
			
			var Rock_Update = function(canvas){
				//make rock fall from the sky
				this.y += 5;
				
				if(this.y > canvas.height){
					delete this;
				}
			};
			
			var array = [];
			
			for(var i=0; i< num; i++){
				var r = {};
				
				r.x = Math.floor((Math.random()*this.canvas.width) + 1);
				r.y = 10;
				
				r.radius = this.ROCK.RADIUS;
				
				r.speed = this.ROCK.SPEED;
				
				r.draw = Rock_Draw;
				r.update = Rock_Update;
				
				Object.seal(r);
				array.push(r);
			}
			
			return array;
		},
		
		///Initialization function
		init: function() {
			this.canvas = document.querySelector("canvas");
			this.ctx = canvas.getContext("2d");
			
			//get sloth Image
			sloth = new Image();
			sloth.src = "art/SleepingSloth.png";
			
			this.rocks = this.makeRocks(5);
			this.update(); //Start the animation loop
		},
		
		///Update, runs the game
		update: function() {
			//Update the animation frame 60 times a second, binding it to call itself
			this.animationID = requestAnimationFrame(this.update.bind(this));
			
			this.ctx.fillStyle = '#87CEEB';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); //Clear the background
			
			//draw sloth
			
			this.ctx.drawImage(sloth, 0,this.canvas.height-100, this.canvas.width, 100);
			
			for(var i =0; i < this.rocks.length; i++){
				var r = this.rocks[i];
				
				r.draw(this.ctx);
				r.update(this.canvas);
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
		}
	};