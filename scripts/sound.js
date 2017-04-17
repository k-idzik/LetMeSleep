"use strict";

var app = app || {};

app.sound = (function(){
	debugger;
	var bgSound = undefined;
	var efSound = undefined;
	var effectSounds = ["boom2.wav", "slingshotFire.mp3"];
	function init(){
		bgSound = document.querySelector("#bgSound");
		bgSound.volume = 0.3;
		efSound = document.querySelector("#efSound");
		efSound.volume = 0.5;
	}
	
	function playBGSound(){
		bgSound.play();
	}
	
	function stopBGSound(){
		bgSound.pause;
		bgSound.currentTime =0;
	}
	
	function playEffect(currEffect){
		efSound.src = "sounds/" + effectSounds[currEffect];
		efSound.play();
	}
	
	return{
		init: init,
		playBGSound: playBGSound,
		stopBGSound: stopBGSound,
		playEffect: playEffect
	};
}());