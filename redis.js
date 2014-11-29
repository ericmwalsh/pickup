var redis = require('redis');

var credentials = {"host":"127.0.0.1", "port": 6379};

var subscriber = redis.createClient(credentials.port, credentials.host);
subscriber.on("error", function(err){
	console.error('There was an error with the subscriber redis client ' + err);
});
var publisher = redis.createClient(credentials.port, credentials.host);
publisher.on("error", function(err){
	console.error('There was an error with the publisher redis client ' + err);
});
if (credentials.password != ''){
	subscriber.auth(credentials.password);
	publisher.auth(credentials.password);
}

module.exports =  publisher;