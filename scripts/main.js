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
    score: 0,
    
    //Images
    sloth: undefined,
	slothHead: undefined,
    rockIMG: undefined,
    bulletImg: undefined,
    
	//Sloth Lives
	slothLives: 3,
	
	//SCREEN STATE
	SCREEN: Object.freeze({
		MAIN: 0,
		INSTRUCTION: 1,
		GAME: 2,
		PAUSED: 3,
		GAMEOVER: 4,
	}),
	
	screenState: 0, //will hold the current screen state of the game
	
	//Slingshot clickpoint
    clickpoint: Object.seal({
        defaultX: 0,
        defaultY: 0,
        x: 0,
        y: 0,
        radius: 10,
        mouseClicked: false,
        previousMouseClicked: false
    }),

    //Rocks
    rocks: [],
    ROCK: Object.freeze({
        RADIUS: 15,
        MIN_RADIUS: 2,
        MAX_RADIUS: 15,
        SPEED: 1,
        VALUE: 5,
        ROCK_ART: this.rockIMG,
    }),
    rockCooldown: 100,
    rockTimer:0,
    maxRocks: 5, //Max rocks allowed at once
    
    //Bullets State
    bullets:[],
    BULLET: Object.freeze({
        RADIUS: 10,
        SPEED:3,
        MAX_BULLETS: 3, //max bullets allowed on scree
        BULLET_ART: this.bulletImg,
    }),
    
	///Makes rocks
    makeRocks: function() {
        var Rock_Draw = function(ctx) {
            //draw rock to canvas
            ctx.save();

            ctx.strokeStyle = "black";
            ctx.fillStyle = "gray";

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();


            ctx.restore();
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

        if(this.rocks.length == 0) {
            var r = {};

            r.x = Math.floor((Math.random()*this.canvas.width) + 1);
            r.y = -20;

            r.radius = this.ROCK.RADIUS;

            r.speed = this.ROCK.SPEED;
            r.value = this.ROCK.VALUE;

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
            r.value = this.ROCK.VALUE;

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
	
    //MAKE BULLET
    makeBullet: function(x, y, direction) {
        var BULLET_UPDATE = function(appRef) {
            direction.normalize();
            
            this.x -= direction.x * this.speed;
            this.y -= direction.y * this.speed;
            
            //TO BE REPLACED WITH SLING SHOT DETERMINING SPEED
            //this.x += this.speed;
            //this.y -= this.speed;
            //////////////////////////////////////////////////
            
            this.CollisionDetection(appRef);
            
            if(this.x < 0 || this.x > appRef.canvas.width || this.y < 0 || this.y > appRef.canvas.height){
                for(var i =0; i < appRef.bullets.length; i++) {
                    if(appRef.bullets[i] == this){
                        appRef.bullets.splice(i, 1);
                        break;
                    }
                }
            }
        };
        
        var BULLET_DRAW = function(ctx) {
            ctx.save();
            
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
            
            ctx.restore();
        };
        
        var Bullet_DetectCollisions = function(appRef) {
            for(var i = 0; i < appRef.rocks.length; i++) {
                var dist = Math.sqrt(Math.pow((appRef.rocks[i].x - this.x),2) + Math.pow((appRef.rocks[i].y - this.y),2));
                
                if(dist < (this.radius + appRef.rocks[i].radius)) {
                    //Bullet is colliding with rock
                    console.dir(appRef);
                    console.log("Score: " + appRef.rocks[i].value);
                    appRef.score += appRef.rocks[i].value;
                    
                    //remove from rocks array
                    appRef.rocks.splice(i, 1);
                    for(var j =0; j < appRef.bullets.length; j++) {
                        if(appRef.bullets[j] == this){
                            appRef.bullets.splice(j, 1);
                            delete this;
                            break;
                        }
                    }
                }
            }
        };
        
        if(this.bullets.length < this.BULLET.MAX_BULLETS) {
            var bullet = {};
            
            bullet.x = x;
            bullet.y = y;
            
            bullet.radius = this.BULLET.RADIUS;
            
            bullet.speed = this.BULLET.SPEED;
            
            bullet.draw = BULLET_DRAW;
            bullet.update = BULLET_UPDATE;
            bullet.CollisionDetection = Bullet_DetectCollisions;
            
            Object.seal(bullet);
            this.bullets.push(bullet);
        }
        
    },
    
    ///Initialization function
    init: function() {
        this.canvas = document.querySelector("canvas");
        this.ctx = canvas.getContext("2d");
        
        //Resize the canvas in code, because media queries would be too easy
        if (window.outerHeight <= 768) {
            this.canvas.setAttribute("height", "576");
            this.canvas.setAttribute("width", "324px");
        }

		this.screenState = this.SCREEN.GAME;
		
        //Set the clickpoint coordinates
        this.clickpoint.defaultX = this.clickpoint.x = this.canvas.width / 2;
        this.clickpoint.defaultY = this.clickpoint.y = this.canvas.height - 220;      
        
        //Hook up events
        this.canvas.onmousedown = this.clickedSlingShot.bind(this);  
        this.canvas.onmouseup = this.clickedSlingShot.bind(this);
        this.canvas.onmousemove = this.moveSlingShot.bind(this);
        
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

        //If the game is paused
        if (this.screenState == this.SCREEN.PAUSED) {
            this.drawPauseScreen(this.ctx);
            return; //Skip the rest of the loop
        }
        
        
        
		if(this.screenState != this.SCREEN.GAMEOVER) {
	        this.makeRocks();
	        
	        for(var i =0; i < this.rocks.length; i++) {
	            var r = this.rocks[i];
	
        	    r.update(this);
        	}
         
            for(var i = 0; i < this.bullets.length; i++){
                var b = this.bullets[i];
                
                b.update(this);
            }
			
			this.useSlingShot();
		}
		
		if(this.slothLives <=0) {
			this.screenState = this.SCREEN.GAMEOVER;
		}
        
        
        
        this.draw();
    },

    ///Everything related to drawing should happen here
    draw: function() {
        //Draw the background
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); //Redraw the background
		switch(this.screenState){
			case this.SCREEN.MAIN:
				//MAIN MENU DRAW LOOP
				break;
				
			case this.SCREEN.INSTRUCTION:
				//Instruction screen DRAW LOOP
				break;
				
			case this.SCREEN.GAME:
				//GAME DRAW LOOP
				//Draws the sloth
        		this.ctx.drawImage(this.sloth, 0,this.canvas.height-100, this.canvas.width, 100); 
        		        
        		this.drawSlingShot(this.ctx); //Draw the slingshot
        		
        		for(var i =0; i < this.rocks.length; i++) {
        		    var r = this.rocks[i];
		
		            r.draw(this.ctx);
		        }
				
		        for(var i = 0; i < this.bullets.length; i++){
		            var b = this.bullets[i];
		            
		            b.draw(this.ctx);
		        }
				//DRAW HUD
				this.drawHUD(this.ctx);
				break;
				
			case this.SCREEN.PAUSED:
				//PAUSE DRAW LOOP
				this.ctx.drawImage(this.sloth, 0,this.canvas.height-100, this.canvas.width, 100); 
        		        
        		this.drawSlingShot(this.ctx); //Draw the slingshot
        		
        		for(var i =0; i < this.rocks.length; i++) {
        		    var r = this.rocks[i];
		
		            r.draw(this.ctx);
		        }
				
		        for(var i = 0; i < this.bullets.length; i++){
		            var b = this.bullets[i];
		            
		            b.draw(this.ctx);
		        }
				//DRAW HUD
				this.drawHUD(this.ctx);
				break;
				
			case this.SCREEN.GAMEOVER:
				//GAME OVER DRAW LOOP
				this.ctx.drawImage(this.sloth, 0,this.canvas.height-100, this.canvas.width, 100); 
        		        
        		this.drawSlingShot(this.ctx); //Draw the slingshot
        		
        		for(var i =0; i < this.rocks.length; i++) {
        		    var r = this.rocks[i];
		
		            r.draw(this.ctx);
		        }
				
		        for(var i = 0; i < this.bullets.length; i++){
		            var b = this.bullets[i];
		            
		            b.draw(this.ctx);
		        }
				//DRAW HUD
				this.drawHUD(this.ctx);
				this.drawGameOverScreen(this.ctx);
				break;
		}
    },

    ///This function will pause the game
    pauseGame: function() {
        this.screenState = this.SCREEN.PAUSED;      
        cancelAnimationFrame(this.animationID); //Stop the animation loop
        this.update(); //Updates the screen once so that the pause screen is shown
    },

    ///This function will resume the game after pause
    resumeGame: function() {
        cancelAnimationFrame(this.animationID); //Stop the animation loop in case it's running
        this.screenState = this.SCREEN.GAME;
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
        //DRAW LIVES
		ctx.textAlign = "left";
        ctx.textBaseline = "top";
		ctx.font = "24pt Open Sans";
		ctx.fillStyle = 'black';
		ctx.fillText("LIVES:" ,0,0);
		
		for(var s =0; s< this.slothLives; s++){
			ctx.drawImage(this.slothHead,(s*50)+100,0, 50,50);
		}
        
        //DRAW SCORE
        ctx.textAlign = "right";
        ctx.fillText("Score: " + this.score,this.canvas.width, 0);
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
    
	///Draw the slingshot
    drawSlingShot: function(ctx) {
        ctx.save(); //Save the canvas state
        
        //Set the line cap type
        ctx.lineCap = "round";
        
        //Draw the slingshot
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#8B4513";
        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2, this.canvas.height - 100);
        ctx.lineTo(this.canvas.width / 2, this.canvas.height - 170);
        ctx.lineTo(this.canvas.width / 2.6, this.canvas.height - 220);
        ctx.moveTo(this.canvas.width / 2, this.canvas.height - 170);
        ctx.lineTo(this.canvas.width - (this.canvas.width / 2.6), this.canvas.height - 220);
        ctx.stroke();
        
        //Draw the slingshot's curved component
        ctx.lineWidth = 5;
        ctx.strokeStyle = "grey";
        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2.6, this.canvas.height - 220);
        ctx.lineTo(this.clickpoint.x, this.clickpoint.y);
        ctx.lineTo(this.canvas.width - (this.canvas.width / 2.6), this.canvas.height - 220);
        ctx.stroke();
        
        //Draw the slingshot's click point
        ctx.fillStyle = "dimgrey";
        ctx.beginPath();
        ctx.arc(this.clickpoint.x, this.clickpoint.y, this.clickpoint.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore(); //Restore the canvas state
    },
   
   	///When the slingshot is clicked on
   	clickedSlingShot: function(e) {
        //If the game is not paused
        if (!this.paused) {
            var mouse = getMouse(e); //Get the position of the mouse on the canvas
            var defaultPoint = new Victor(this.clickpoint.defaultX, this.clickpoint.defaultY);
            var movedPoint = new Victor(this.clickpoint.x, this.clickpoint.y);
            
            //Check event type and set if the clickpoint is being used
            if (e.type == "mousedown" && clickedInsideSling(mouse.x, mouse.y, this.clickpoint) && defaultPoint.distance(movedPoint) < 1)
                this.clickpoint.mouseClicked = true;
            else if (e.type == "mouseup") {
                this.clickpoint.mouseClicked = false; //The mouse is not being clicked
                this.clickpoint.previousMouseClicked = true; //The mouse was previously clicked
            }
        }
    },
   
   	//When the slingshot is moved
   	moveSlingShot: function(e) {
   	    //If the mouse if being clicked and the game is not paused, allow the slingshot to be used
   	    if (this.clickpoint.mouseClicked && !this.paused) {
            //Make vectors to limit the distance the slingshot can move
            var defaultPoint = new Victor(this.clickpoint.defaultX, this.clickpoint.defaultY);
            var movedPoint = new Victor(this.clickpoint.x, this.clickpoint.y);
            
            //Limit the distance the slingshot can move
            if (defaultPoint.distance(movedPoint) < 100) {
                var mouse = getMouse(e); //Get the position of the mouse on the canvas

                this.clickpoint.x = mouse.x;
                this.clickpoint.y = mouse.y;
            }
   	    }
   	},
    
    //When the slingshot is used
   	useSlingShot: function() {
        if (!this.clickpoint.mouseClicked) {
            var defaultPoint = new Victor(this.clickpoint.defaultX, this.clickpoint.defaultY);
            var movedPoint = new Victor(this.clickpoint.x, this.clickpoint.y);
            
            //If the current point is not close to the default point, elastify the slingshot back
            if (defaultPoint.distance(movedPoint) > 1) {
                this.clickpoint.x -= (movedPoint.x - defaultPoint.x) / 3;
                this.clickpoint.y -= (movedPoint.y - defaultPoint.y) / 3;     
            }
            
            //Fire a bullet
            if (this.clickpoint.previousMouseClicked) {
                this.makeBullet(this.clickpoint.x, this.clickpoint.y, Victor(movedPoint.x - defaultPoint.x, movedPoint.y - defaultPoint.y)); //Make a bullet
                this.clickpoint.previousMouseClicked = false;
            }
        }
   	}
};