//Playlist with preconfigured track id's
var playList = [{ id: 'spotify:track:2BgD1WUT45SDvAqyNAzR3S', position: 0 },
				{ id: 'spotify:track:6u4eFc9qtTqJ7iArcJOlVz', position: 0 },
				{ id: 'spotify:track:6oVY50pmdXqLNVeK8bzomn', position: 0 },
				{ id: 'spotify:track:2eeAKnSvQlMaqz3DKxPy8e', position: 0 },
				{ id: 'spotify:track:4vLYewWIvqHfKtJDk8c8tq', position: 0 },
				{ id: 'spotify:track:4XD6hKxQevRCcqKo7XeMtD', position: 0 },
				{ id: 'spotify:track:4nHR6kbvQXMQjAaIpZfLC4', position: 0 },
				{ id: 'spotify:track:28ZShfFLY9CgLpd8APVsNo', position: 0 },
				{ id: 'spotify:track:6kajWUlW8caqSpWvHCbkTN', position: 0 },
				{ id: 'spotify:track:4Vkk3iD1VrENHJEACNddvt', position: 0 }];

//retrieve random track from playlist
exports.getRandomTrack = function(){
	result = playList[Math.floor((Math.random() * 7) + 1)];
	return result;
}


exports.getTrackPos = function(trackId){
	for(var i = 0; i < playList.length-1; i++){
		var trackObj = playList[i]
		if(trackId == trackObj.id){
			return i;
		}
	}
}

exports.getTrackFromPos = function(pos){
	return playList[pos];
}

exports.getPreviousTrack = function(pos){
	if(!pos > 0){
		return playList[playList.length-1];
	} else {
		return playList[pos-1];
	}
}

exports.getNextTrack = function(pos){
	if(pos >= playList.length-1){
		console.log('nextTrack --> ' + playList[0] + ' pos:' + pos + ' of:' + playList.length);
		return playList[0];
	} else {
		console.log('nextTrack --> ' + playList[pos+1] + ' pos:' + pos + ' of:' + playList.length);
		return playList[pos+1];
	}
}