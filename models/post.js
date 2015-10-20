var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	newComment: String
});

var PostSchema = new Schema({
	newPost: String,
	comments: [CommentSchema]
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;