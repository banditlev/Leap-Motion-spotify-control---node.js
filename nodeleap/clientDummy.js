var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());

var playList = [{ id: 'spotify:track:3s2RFp5hU6jEvAmfZrnrAi', position: 0 },
		{ id: 'spotify:track:3psBDYDapH376ErW8D7ZXO', position: 0 },
		{ id: 'spotify:track:6f6OQJv9qjqyJq9NHin45n', position: 0 },
		{ id: 'spotify:track:6f6OQJv9qjqyJq9NHin45n', position: 0 },
		{ id: 'spotify:track:4nbqUfqKObLWhuUT7PWV1N', position: 0 },
		{ id: 'spotify:track:58VcgWixvxnMdt4bj29PdQ', position: 0 },
		{ id: 'spotify:track:3PJMsxg6rz9FOo6xNiASXz', position: 0 },
		{ id: 'spotify:track:58VcgWixvxnMdt4bj29PdQ', position: 0 }];

var serverInit = function(){
	
	server.get('/playstate', function (req, res, next) {
		spotifyHandler(function(callback){
			res.send(callback);
			console.log('sending back string: ' + callback);
			res.end();
			return next();
		});
	});
	
	//get exceptions from restify
	server.on('uncaughtException', function (req, res, route, err) {
   		console.log('uncaughtException', err.stack);
   	});
	server.listen(2092, function() {
		console.log('%s listening at %s', server.name, server.url);
	});	
}

//Get current state of spotify
var spotifyHandler = function(callback){
	var trackId;
	var result;
	result = playList[Math.floor((Math.random() * 7) + 1)];
	callback(result);
}
serverInit();