// REQUIREMENTS
var express = require("express"),
		app = express(),
		ejs = require("ejs"),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose");


// CONFIG



// ROUTES
app.get('/', function(req, res) {
	res.send("I am working");
});


// LISTEN
app.listen(3000, function(req, res) {
	console.log("listening on port 3000");
});





