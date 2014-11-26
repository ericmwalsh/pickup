// dependencies
var app 	= require('express')();
var bodyParser = require('body-parser');
var express = require('express');
var http 	= require('http').Server(app);
var router	= require('./router');	
var redis = require('redis');

// setup
app.set('port', process.env.PORT || 3000);
app.set('views', 'views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

const PORT = app.get('port');

// server
var server = app.listen(PORT, function() {
	console.log('listening on ' + PORT);
});