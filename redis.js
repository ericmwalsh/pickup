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

//delegates the 'subscriber' client to run a deletion script every time a posting expires
function subscribe(pattern){
    subscriber.psubscribe(pattern);
    subscriber.on('pmessage', function(pattern, channel, message){     
    	var luaScript = "local delPost = cjson.decode(redis.call('get', 'posting:' .. KEYS[1])) \
    		redis.call('del', 'posting:' .. KEYS[1]) \
    		redis.call('srem', 'allSports', KEYS[1]) \
    		redis.call('srem', 'allSkills', KEYS[1]) \
    		redis.call('srem', delPost['sport'], KEYS[1]) \
    		redis.call('srem', 'level' .. delPost['skill'], KEYS[1]) \
    		return";

    	publisher.eval(luaScript, 1, message, function(err, res){
    		console.dir(err); // errors if any
    		console.dir(res); // whatever luaScript returns, currently nothing
    	})

        //console.log('on publish / subscribe   '+  pattern+'   '+channel+'     '+message);
    });
}
subscribe("__keyevent@0__:expired");



//returned to router.js
module.exports = {

	addObject: function(key, value) { //value is in JSON form
		publisher.multi().setex(key, 7200, key).set("posting:" + key, JSON.stringify(value)).
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