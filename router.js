var router = require('express').Router();
var redis = require('./redis');

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/home', function(req, res) {
	res.render('homepage');
});

router.get('/msg/', function(req, res) {
	res.send("Hello World spicy fries!");
});

router.post('/post/', function(req, res){
	console.log(req.body);
	console.log("ip of sender : " + req.connection.remoteAddress);
	//request.headers['X-Forwarded-For']

	//redis.addPosting(req.connection.remoteAddress, req.body);
	redis.getAllPostings(req.body);

	//redis.hmset(req.connection.remoteAddress, req.body);
	//redis.expire(req.connection.remoteAddress, 7200);
	res.sendStatus(200);
});


router.use(function(req, res, next){
  res.status(404).send("Sorry can't find that!");
});

module.exports = router;