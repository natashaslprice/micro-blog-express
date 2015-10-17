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
var Comment = require("./models/comment.js");



// ROUTES
// render index page
app.get('/', function(req, res) {
	Post.find({}, function(err, posts){
		if (err) {
			console.log(err);
		}
		Comment.find({}, function(err, comments){
			if (err) {
				console.log(err);
			}
			res.render('index', { posts: posts, comments: comments } );
		});
	});
});

// api GET route for posts
app.get('/api/posts', function(req, res){
	res.json(posts);
});

// api GET route for comments
app.get('/api/comments', function(req, res){
	res.json(comments);
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

// DELETE route for new posts
app.delete('/posts/:_id', function(req, res){
	Post.findOne( { _id: req.params._id } , function(err, post){
		if (err) {
			console.log(err);
		}
		post.remove(function(err){
			res.json(post);
		});
	});
});

// POST route for new comments
app.post('/api/comments', function(req, res){
	Comment.create(req.body, function(err, comment){
		if (err) {
			console.log(err);
		}
		res.json(comment);
	});
});




// LISTEN
app.listen(3000, function(req, res) {
	console.log("listening on port 3000");
});





