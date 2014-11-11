// dependencies
var app 	= require('express')();
var http 	= require('http').Server(app);	

// setup
app.set('port', process.env.PORT || 3000);

const PORT = app.get('port');

app.get('/', function(req, res) {
	res.send('Hello World');
});

// server
var server = app.listen(PORT, function() {
	console.log('listening on ' + PORT);
});