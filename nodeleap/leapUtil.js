var movement;
var knuckleCounter = [];
var countUpKnocks = 0;
var lastKnock;
var lastHandPos = [0,0,0];
var outOfViewTimer = new Date().getTime();
var lastTrackedKnock = new Date().getTime();
var knockDiff = 0;
var sleepTimer = new Date().getTime();

//Check for single knocking gesture 
exports.checkForKnockGesture = function(frame){	
	if(frame.valid && frame.hands.length > 0 && (new Date().getTime() - outOfViewTimer) > 200){
			var hand = frame.hands[0];
			var extendedFingers = 0;
		    for(var f = 0; f < frame.fingers.length; f++){
		        var finger = frame.fingers[f];
		        if(finger.extended) extendedFingers++;
			}
			var speed = hand.palmVelocity;
			currentHandPos = hand.palmPosition;
			
			//Calculate movement from given vectors
			var movements = [
		        {direction: "x", distance: speed[0] - lastHandPos[0]},
		        {direction: "y", distance: speed[1] - lastHandPos[1]},
		        {direction: "z", distance: speed[2] - lastHandPos[2]}
			];
			
			var dominantMovement = movements.sort(function(a, b) {
				return Math.abs(a.distance) > Math.abs(b.distance) ? -1 : 1})[0];
				
			//Check for direction 
			if (dominantMovement.direction == "y" &&  extendedFingers == 0) {
				knuckleCounter.push(dominantMovement.distance);
				//Trim knuckleCounter
				if(knuckleCounter > 4) knuckleCounter.shift();
			}
			
			//Calculate vel over 4 frames movements[1].distance
			var avgVel = 0;
			var secondMovement = movements[1].distance;
			for(i=0; i < knuckleCounter.length; i++){
				avgVel += knuckleCounter[i];
			}
			avgVel = avgVel/knuckleCounter.length;

			if(avgVel < -15 && secondMovement < 30 && secondMovement > -30){
				countUpKnocks = countUpKnocks+1;
				if(countUpKnocks > 3){
					console.log('knocking');
					countUpKnocks = 0;
					knuckleCounter.length = 0;
					outOfViewTimer = new Date().getTime();
					knockDiff = new Date().getTime() - lastTrackedKnock;
					var sleepDiff = new Date().getTime() - sleepTimer;
					console.log('Difference --> ' + knockDiff + ' sleepDiff --> ' + sleepDiff);
					if(knockDiff < 2500 && sleepDiff > 3000) {
						sleepTimer = new Date().getTime();
						return true;
					}
					lastTrackedKnock = new Date().getTime();
				}			
			}
			
		lastHandPos = speed;
	}
}

//reset the knuckle counter
exports.resetKnuckleCounter = function(){
	knuckleCounter.length = 0;
}

//Update out of view timer to current time 
exports.updateOutOfView = function(){
	outOfViewTimer = new Date().getTime();
}