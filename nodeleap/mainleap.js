require('./node_modules/leapjs/template/entry.js');
var SerialPort = require("serialport").SerialPort;
var leapUtil = require('./leapUtil');
var server = require('./serverUtil.js');
var spotify = require('./spotifyUtil.js');
var organizer = require('./gestureOrganizer.js');
var frame;
var controller = new Leap.Controller();
var lastFrame;
var currentHandPos;
var lastGestureTracked = new Date().getTime();
var lastHandState;
var colorRed = false;
var side;
var handEnterTime = new Date().getTime();

var serialPort = new SerialPort("/dev/cu.usbmodemfa131", {
  baudrate: 9600
});

var _this = this;
var chainState = 'diverse';

var controller = Leap.loop({enableGestures: true}, function(frame){
	//Retrieve hand type information from frame
	if(frame.hands.length > 0) side = frame.hands[0].frame.data.hands[0].type;
	
	//Require gestures and sort out usefull ones
	if(frame.valid && frame.gestures.length > 0){
	    var gestureType = frame.gestures[0].type;
	    //Sort out swipe gesture
	    if (gestureType === "swipe"){
			//Calculate direction
			if (frame.gestures[0].direction[0] > 0){
				//Right swipe
				if((new Date().getTime() - lastGestureTracked) > 500 && (new Date().getTime() - handEnterTime) > 100){	
					//Shift forward in spotify
					organizer.swipeRight(side);
				}
				lastGestureTracked = new Date().getTime();
			} else{
				//Left swipe
				if((new Date().getTime() - lastGestureTracked) > 500 && (new Date().getTime() - handEnterTime) > 100){
					//shift backward in spotify
					organizer.swipeLeft(side);
				}
				lastGestureTracked = new Date().getTime();
			}
		}
		
		//check for tab gestures
		if(gestureType === "screenTap"){
			organizer.screenTap(side);
		}
		
		//Check for circle gesture
		if(gestureType === "circle"){
			var gesture = frame.gestures[0];
			var clockwise = false;
			var pointableID = gesture.pointableIds[0];
			var direction = frame.pointable(pointableID).direction;
			var dotProduct = Leap.vec3.dot(direction, gesture.normal);
			
			//calculate direction
			if (dotProduct  >  0) clockwise = true;
			
			//Adjust volume according to direction
			if((new Date().getTime() - lastGestureTracked) > 300 && (new Date().getTime() - handEnterTime) > 300){
				if(clockwise){
					organizer.circleGesture('clockwise', side);
				}else{
					organizer.circleGesture('anticlockwise', side);
				}
				lastGestureTracked = new Date().getTime();
			}
		}
	}
	
	//Check leap data for knocking gesture
	if(leapUtil.checkForKnockGesture(frame)){
			organizer.knockGesture(side);
	}

	//Do stuff when no hands are vivible
	if(frame.valid && frame.hands.length <= 0){
		leapUtil.resetKnuckleCounter();
		leapUtil.updateOutOfView();
		if(lastHandState){
			serialPort.write('1' + 'P');
			//console.log('hand not in site');
			lastHandState = false;
		}  
	} else if(!lastHandState){
		serialPort.write('0' + 'P');
		//console.log( side + ' hand in site');
		handEnterTime = new Date().getTime();
		lastHandState = true;
	}
});	

exports.changeColor = function(newChainState){
	switch(newChainState){
		case 'diverse':
			serialPort.write('0' + 'E');
			console.log('serial write 0');
			break;
		case 'left':
			serialPort.write('1' + 'E');
			console.log('serial write 1');

			break;
		case 'right':
			serialPort.write('2' + 'E');
			console.log('serial write 2');
			break;
	}
	
}

exports.setChainState = function(newState){
	console.log('setting chainState --> ' + newState);
	chainState = newState;
}

exports.getChainState = function(callback){
	console.log('in getChainState chainState = ' + chainState);
	callback(chainState);
}

controller.on('ready', function() {
	    console.log("ready");
	});
controller.on('connect', function() {
    console.log("connect");
});
controller.on('disconnect', function() {
    console.log("disconnect");
});
controller.on('focus', function() {
    console.log("focus");
});
controller.on('blur', function() {
    console.log("blur");
});
controller.on('deviceConnected', function() {
    console.log("deviceConnected");
});
controller.on('deviceDisconnected', function() {
    console.log("deviceDisconnected");
});

//Initiate Stuff
controller.connect();
server.serverInit();
