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

//subscribe to keyevent notifications for expires in the DB
//console.log(publisher.config.toString());
//publisher.config("SET notify-keyspace-events Ex", function(){console.log("helo");});//, "notify-keyspace-events Ex");

module.exports = {

	addObject: function(key, value) { //value is in JSON form
		publisher.multi().setex("posting:" + key, 7200, JSON.stringify(value)).
			sadd("allSports", key).
			sadd("allSkills", key).
			sadd(value.sport, key).
			sadd("level" + value.skill, key).
			exec(function(err, replies){
				/**console.log("MULTI got " + replies.length + " replies");
            	replies.forEach(function (reply, index) {
                	console.log("Reply " + index + ": " + reply.toString());
            	});**/
			});
	}

};