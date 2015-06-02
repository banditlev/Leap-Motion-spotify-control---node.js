var restify = require('restify');
var spotify = require('./spotifyUtil');
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());

var peerPort = 5050;
var peerIp = '10.0.0.4';

exports.serverInit = function(){
	//Serve current play state on Get request
	server.get('/playstate', function (req, res, next) {
		spotify.getTrackIdAndPos(function(callback){
			res.send(callback);
			console.log('sending back string: ' + callback);
			res.end();
			return next();
		});
	});
	
	var localPort = Math.floor((Math.random() * 1100) + 1000);
	console.log('localport: '+ localPort);
	
	//get exceptions from restify
	server.on('uncaughtException', function (req, res, route, err) {
   		console.log('uncaughtException', err.stack);
   	});
	server.listen(localPort, function() {
		console.log('%s listening at %s', server.name, server.url);
	});	
}

//Retrieve olay info from peer application
exports.retrivePeerPlayerInfo = function(callback){
	var client = restify.createJsonClient({
		url: 'http://'+peerIp+':'+peerPort,
		version: '*'
	});
	//retrieve peers playstate and state retrived song
	client.get('/playstate', function(err, req, res, obj) {
		//assert.ifError(err);
		console.log('%j', obj);
		//Play track
		//spotify.playTrack(obj.id, obj.position);
		var id = obj.id;
		callback(id); 
	});
}

//Send  play comands to peer
exports.sendPeerCommand = function(_command){
	var client = restify.createJsonClient({
		url: 'http://'+peerIp+':'+peerPort,
		version: '*'
	});
	console.log('sending peer command to -> http://'+peerIp+':'+peerPort);
	client.post('/playcommand', { command:_command }, function(err, req, res, obj) {
		//assert.ifError(err);
	});
}

//send track for peer to play
exports.peerPlayTrack = function(_id, _position){
		var client = restify.createJsonClient({
			url: 'http://'+peerIp+':'+peerPort,
			version: '*'
		});
		
		client.post('/playtrack',{ id:_id, position:_position } , function(err, req, res, obj) {
			//assert.ifError(err);
		});
	/*spotify.getTrackIdAndPos(function(callback){
		var client = restify.createJsonClient({
			url: 'http://'+peerIp+':'+peerPort,
			version: '*'
		});
		
		client.post('/playtrack',callback , function(err, req, res, obj) {
		
		});
	});*/
} 