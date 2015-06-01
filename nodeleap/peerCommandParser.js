var restify = require('restify');
var spotify = require('./spotifyUtil');
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());
var _this = this;


var serverInit = function(){
	//Serve current play state on Get request
	server.get('/playstate', function (req, res, next) {
		spotify.getTrackIdAndPos(function(callback){
			res.send(callback);
			console.log('sending back string: ' + callback);
			res.end();
			return next();
		});
	});
	
	server.post('/playcommand', function(req, res, next){
		var command = req.body.command;
		console.log('recieved command --> ' + command);
		handleCommand(command);
	});
	
	server.post('/playtrack', function(req, res, next){
		var id = req.body.id;
		var track = req.body.track;
		console.log('recieved track --> ' + track);
		spotify.playTrack(id, track);
	});
	
	var localPort = 5050//Math.floor((Math.random() * 1100) + 1000);
	console.log('localport: '+ localPort);
	
	//get exceptions from restify
	server.on('uncaughtException', function (req, res, route, err) {
   		console.log('uncaughtException', err.stack);
   	});
	server.listen(localPort, function() {
		console.log('%s listening at %s', server.name, server.url);
	});	
}

var handleCommand = function(command){
	switch(command){
		case 'next':
			spotify.nextTrack();
			break;
		case 'previous':
			spotify.previousTrack();
			break;
		case 'playpause':
			spotify.playPause();	
			break;
		case 'volumeup':
			console.log('volumeUp');
			spotify.volumeUp();
			break;
		case 'volumeDown':
			spotify.volumeDown();
			break;
	}
}

serverInit();