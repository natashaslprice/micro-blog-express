// REQUIREMENTS
var express = require("express"),
		app = express(),
		ejs = require("ejs"),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose");


// CONFIG
// set ejs as view engine
app.set('view engine', 'ejs');
// serve js & css files
app.use("/static", express.static("public"));
// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
// connecting mongoose
mongoose.connect('mongodb://localhost/microBlog');
var Post = require("./models/post.js");



// ROUTES
// render index page
app.get('/', function(req, res) {
	Post.find({}, function(err, posts){
		if (err) {
			console.log(err);
		}
		res.render('index', { posts: posts } );
	});
});

// api GET route for posts
app.get('/api/posts', function(req, res){
	Post.find({}, function(err, posts){
		if (err) {
			console.log(err);
		}
		res.json(posts);
	});
});


// POST route for new posts
app.post('/api/posts', function(req, res){
	Post.create(req.body, function(err, post){
		if (err) {
			console.log(err);
		}
		res.json(post);
	});
});

// DELETE route for posts
app.delete('/api/posts/:id', function(req, res){
	Post.findOne( { _id: req.params.id } , function(err, post){
		if (err) {
			console.log(err);
		}
		post.remove(function(err){
			res.json(post);
		});
	});
});

// POST route for new comments
app.post('/api/posts/:id/comments', function(req, res){
	Post.findOne( { _id: req.params.id } , function(err, post){
		if (err) {
			console.log(err);
		}
		console.log(req.body);
		post.comments.push(req.body);
		post.save(function(err){
			if (err) {
				console.log(err);
			}
			res.json(post);
		});
	});
});



// render singlepost page
app.get('/posts/:id', function(req, res) {
	// console.log(req.params);
	Post.findById( { _id: req.params.id } , function(err, post){
		if (err) {
			console.log(err);
		}
			res.render('singlepost', { post: post } );
	});
});



// LISTEN
app.listen(3000, function(req, res) {
	console.log("listening on port 3000");
});
