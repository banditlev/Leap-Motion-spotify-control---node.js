var spotify = require('./spotifyUtil.js');
var server = require('./serverUtil.js');
var main = require('./mainleap.js');
var playlist = require('./playlist.js');
var inherentSide = 'right';

var trackPosLeft = 0;
var trackPosRight = 0;

exports.swipeLeft = function(hand){
	var chainState = '';
	console.log('in left swipe');
	main.getChainState(function(callback){
		chainState = callback;
		if(chainState == 'diverse'){
			if(hand === 'right'){
				var prev = playlist.getPreviousTrack(trackPosRight);
				spotify.playTrack(prev.id, 0);
				trackPosRight < 8 ? trackPosRight++ : trackPosRight = 0;	
			}
			if(hand === 'left'){
				//Call peer player
				var prev = playlist.getPreviousTrack(trackPosLeft);
				server.peerPlayTrack(prev.id, 0);
				//server.sendPeerCommand('previous');
				trackPosLeft < 8 ? trackPosLeft++ : trackPosLeft = 0;
				console.log('swipe left, left --> ' + prev);
			}
		} else {
			console.log('prev both sides')
			var prev = playlist.getPreviousTrack(trackPosRight);
			spotify.playTrack(prev.id, 0);
			server.peerPlayTrack(prev.id, 0);
			trackPosLeft < 8 ? trackPosLeft++ : trackPosLeft = 0;
			trackPosRight < 8 ? trackPosRight++ : trackPosRight = 0;
		}
	});
}

exports.swipeRight = function(hand){
	var chainState = '';
	main.getChainState(function(callback){
		chainState = callback;
		if(chainState == 'diverse'){
			if(hand === inherentSide){
				var next = playlist.getNextTrack(trackPosRight);
				spotify.playTrack(next.id, 0);	
				trackPosRight < 8 ? trackPosRight++ : trackPosRight = 0;
			}else {
				//Call peer player
				var next = playlist.getNextTrack(trackPosLeft);
				server.peerPlayTrack(next.id, 0);
				//server.sendPeerCommand('previous');
				trackPosLeft < 8 ? trackPosLeft++ : trackPosLeft = 0;
				console.log('swipe left, left --> ' + next);
			}
		} else {
			var next = playlist.getNextTrack(trackPosRight);
			spotify.playTrack(next.id, 0);
			server.peerPlayTrack(next.id, 0);
			console.log('next both sides playing tracks left:' + next.id + ' right:' + next.id);
			trackPosLeft < 8 ? trackPosLeft++ : trackPosLeft = 0;
			trackPosRight < 8 ? trackPosRight++ : trackPosRight = 0;
		}
	});
}

exports.screenTap = function(hand){
	if(hand === inherentSide){
		spotify.playPause();
	}else {
		//Call peer player
		server.sendPeerCommand('playpause');
		console.log('playPause left');
	}
}

exports.circleGesture = function(direction, hand){
	if(hand === inherentSide){
		if(direction == 'clockwise'){
			console.log('clockwise --> ' + hand);
			spotify.volumeUp();
		} else if(direction == 'anticlockwise'){
			console.log('anticlockwise --> ' + hand);
			spotify.volumeDown();
		}
	} else if(direction == 'clockwise' && hand == 'left'){
			server.sendPeerCommand('volumeup');
		} if(direction == 'anticlockwise' && hand == 'left'){
			server.sendPeerCommand('volumedown');
		}
}

exports.knockGesture = function(hand){
	console.log('in knockGesture function');
	var chainState = '';
	main.getChainState(function(callback){
		chainState = callback;
	
		console.log('ChainState --> ' + chainState);
		
		if(chainState == 'diverse'){
			if(hand === inherentSide){
				server.retrivePeerPlayerInfo();
				console.log('knock right');
				main.changeColor('right');
				main.setChainState('right');
			}else {
				//call peer player with current music
				var newTrack = playlist.getTrackFromPos(0);
				server.peerPlayTrack(newTrack.id, 0);
				console.log('knock left');
				main.changeColor('left');
				main.setChainState('left');
			}
		}
		if(chainState != 'diverse'){
			if(hand === inherentSide){
				var track = playlist.getTrackFromPos(0);
				spotify.playTrack(track.id, track.position);
				console.log('knock right');
				main.changeColor('diverse');
				main.setChainState('diverse');
			}else {
				var track = playlist.getTrackFromPos(0);
				spotify.playTrack(track.id, track.position);
				console.log('knock left');
				main.changeColor('diverse');
				main.setChainState('diverse');
			}
		}
	});
}