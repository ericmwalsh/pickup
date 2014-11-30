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
    	var delScript = "local delPost = cjson.decode(redis.call('get', 'posting:' .. KEYS[1])) \
    		redis.call('del', 'posting:' .. KEYS[1]) \
    		redis.call('srem', 'allSports', KEYS[1]) \
    		redis.call('srem', 'allSkills', KEYS[1]) \
    		redis.call('srem', delPost['sport'], KEYS[1]) \
    		redis.call('srem', 'level' .. delPost['skill'], KEYS[1]) \
    		return";

    	publisher.eval(delScript, 1, message, function(err, res){
    		console.dir(err); // errors if any
    		console.dir(res); // whatever luaScript returns, currently nothing
    	});

        //console.log('on publish / subscribe   '+  pattern+'   '+channel+'     '+message);
    });
}
subscribe("__keyevent@0__:expired");



//returned to router.js
module.exports = {

	addPosting: function(key, value) { //value is in JSON form
		//value.latitude = 34.237371;
		//value.longitude = -118.574431;
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
	},
	getAllPostings: function(value){ //value is in JSON form
		var sportSet = value.sport == "allSports" ? "allSports" : value.sport;
		var skillSet = value.skill == "allSkills" ? "allSkills" : "level" + value.skill;

		var getScript = "local postingIDs = redis.call('sinter', KEYS[1], KEYS[2]) \
			local lat1= ARGV[1]*0.0174532925 \
			local lon1= ARGV[2]*0.0174532925 \
			\
			local postings = {} \
			for i=1, #postingIDs do \
				local tempPostRaw = redis.call('get', 'posting:' .. postingIDs[i]) \
				local tempPost = cjson.decode(tempPostRaw) \
				local lat2= tempPost['latitude']*0.0174532925 \
				local lon2= tempPost['longitude']*0.0174532925 \
				local dlon = lon2-lon1 \
				local dlat = lat2-lat1 \
				local a = math.pow(math.sin(dlat/2),2) + math.cos(lat1) * math.cos(lat2) * math.pow(math.sin(dlon/2),2) \
				local c = 2 * math.asin(math.sqrt(a)) \
				local dist = 6371 * c * 0.621371 \
				if dist <= tonumber(ARGV[3]) then \
					table.insert(postings, tempPostRaw) \
				end \
			end \
			return postings";
		var final;
		publisher.eval(getScript, 2, sportSet, skillSet, value.latitude, value.longitude, value.distance, function(err, res){
			//console.dir(err);
			//console.dir(res);
			var finalPostings = [];
			res.forEach(function(entry){
				finalPostings.push(JSON.parse(entry));
				//console.log('happy');
				//console.log(JSON.parse(entry));
			})
			final = finalPostings;
			console.log('happyness');
			console.log(final);
		});
		//return final;
	}



};