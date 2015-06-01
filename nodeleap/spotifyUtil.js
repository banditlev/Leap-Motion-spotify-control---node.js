var spotify = require('spotify-node-applescript');
var _this = this;

//Retrieve status information from player
exports.getTrackIdAndPos = function(callback){
	var trackId;
	var result;
	spotify.getTrack(function(err, track){
		trackId = track.id;
		spotify.getState(function(err, state){
			result = {id:trackId, position:state.position};
			callback(result);
		});
	});
}

//Play track from id and start from specified position
exports.playTrack = function(id, position){
	spotify.playTrack(id, function(){
		//Jump to specified sencond
		spotify.jumpTo(position, function() {
			//console.log('Jumped to 15th second of the song');
		});
	});
}

//Play pause feature
exports.playPause = function(){
	spotify.playPause();
}

//Start previous track
exports.previousTrack = function(){
	spotify.previous(function(){
		console.log('Shifting to previous Track');
		_this.getTrackIdAndPos(function(callback){
			console.log(callback);
		});
	});
}

//Start next track
exports.nextTrack = function(){
	spotify.next(function(){
		console.log('Shifting to next Track');
		_this.getTrackIdAndPos(function(callback){
			console.log(callback);
		});
	});
}

//Raise volume 1 unit
exports.volumeUp = function(){
	spotify.volumeUp();
}

//Lower volume 1 unit
exports.volumeDown = function(){
	spotify.volumeDown();
}