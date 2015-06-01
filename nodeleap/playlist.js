//Playlist with preconfigured track id's
var playList = [{ id: 'spotify:track:3s2RFp5hU6jEvAmfZrnrAi', position: 0 },
		{ id: 'spotify:track:3psBDYDapH376ErW8D7ZXO', position: 0 },
		{ id: 'spotify:track:6f6OQJv9qjqyJq9NHin45n', position: 0 },
		{ id: 'spotify:track:6f6OQJv9qjqyJq9NHin45n', position: 0 },
		{ id: 'spotify:track:4nbqUfqKObLWhuUT7PWV1N', position: 0 },
		{ id: 'spotify:track:58VcgWixvxnMdt4bj29PdQ', position: 0 },
		{ id: 'spotify:track:3PJMsxg6rz9FOo6xNiASXz', position: 0 },
		{ id: 'spotify:track:58VcgWixvxnMdt4bj29PdQ', position: 0 }];

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
	if(pos <= 0){
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