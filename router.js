var router = require('express').Router();

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/msg/', function(req, res) {
	res.send("Hello World spicy fries!");
});


router.use(function(req, res, next){
  res.status(404).send("Sorry can't find that!");
});

module.exports = router;