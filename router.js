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

router.get('/posts/', function(req, res){
	console.log(req.body);
	console.log("ip of sender : " + req.connection.remoteAddress);
	redis.getAllPostings(req.body);
	redis.sendStatus(200);
});

router.post('/post/', function(req, res){
	console.log(req.body);
	console.log("ip of sender : " + req.connection.remoteAddress);
	//alternative way to obtain ip address
	//request.headers['X-Forwarded-For']
	redis.addPosting(req.connection.remoteAddress, req.body);
	res.sendStatus(200);
});


router.use(function(req, res, next){
  res.status(404).send("Sorry can't find that!");
});

module.exports = router;