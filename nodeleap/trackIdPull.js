var main = function() {
	var util = require('util');
	var spotify = require('./spotifyUtil');
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', function(data) {
			data = data.replace('\n', '').replace('\r', '');
			if (data.indexOf('p') == 0) {
				spotify.getTrackIdAndPos(function(callback){
					console.log(callback);
					//process.stdout.write(callback);
				});
			}
	});
}
main();