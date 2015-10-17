//CLIENT SIDE JS

$(document).ready(function() {
	console.log("test");

	// CREATE NEW POST
	// on submit of #newPost form
	$('#newPost').submit(function(e) {
		e.preventDefault();
		console.log("newPost form submitted");

		// ajax post to server
		$.ajax({
			url: "/api/posts",
			type: "POST",
			data: $(this).serialize()
		}).done(function(data) {
				console.log(data);
				// turn serialized data into <li> and string
				var postHTML = makeHTMLStringPost(data);
				//prepend to list
				$("#post-ul").prepend(postHTML);
				// clear form
				$("#newPost")[0].reset();
				// give focus back to #newPostInput
				$("#newPostInput").focus();
		}).fail(function(data){
				console.log("post form did not post to server");
		});
	});
	// END OF CREATE NEW POST

	// DELETE POST
	// on click of .delete form
	$('#post-ul').on('click', '.delete', function(e) {
		e.preventDefault();
		console.log("delete button clicked");

		// find id of .delete button
		var deletePostId = $(this).data().id;
		console.log(deletePostId);
		// definte what it is going to delete
		var deletePost = $(this).closest('li');

		// ajax post to server
		$.ajax({
			url: "/posts/" + deletePostId,
			type: "DELETE",
		}).done(function(data) {
			$(deletePost).remove();
		}).fail(function(data){
			console.log("post was not deleted");
		});
	});
	// END OF DELETE POST

	// CREATE NEW COMMENT
	// on submit of #newComment form
	$('.updateButtons').click(function(e) {
		e.preventDefault();
		console.log("newComment form submitted");
		console.log($(this).siblings().serialize());
		var correctId = $(this).attr('data-id');
		console.log(correctId);

		// ajax post to server
		$.ajax({
			url: "/api/comments",
			type: "POST",
			data: $(this).siblings().serialize()
		}).done(function(data) {
				console.log(data);
				// turn serialized data into <li> and string
				var postHTML = makeHTMLStringComment(data);
				//prepend to list
				var correctComment = $('.comment-ul[data-id="' + correctId + '"]');
				correctComment.prepend(postHTML);
				// clear form
				$(".newComment")[0].reset();
				// give focus back to #newPostInput
				$("#newCommentInput").focus();
		}).fail(function(data){
				console.log("comment form did not post to server");
		});
	});
	// END OF CREATE NEW COMMENT


}); // END OF DOC READY



// MAKE HTML STRING POST FUNCTION
function makeHTMLStringPost (data){
	return '<li class="list-group-item">' +
						data.newPost +
						'<button type="button" data-id="' + data._id + '" class="delete btn btn-default btn-sm"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>' +
						'<br>' +
						'<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#toggle' + data._id + '" aria-expanded="false" aria-controls="toggle' + data._id + '">' +
						  'Comments' +
						'</button>' +
						'<div class="collapse" id="toggle' + data._id + '">' +
						  '<div class="well">' +
						    '<form data-id="' + data._id + '" class="form-group newComment">' +
						      '<input type="text" id="newCommentInput" name="newComment" class="form-control" placeholder="Comments...">' +
						      '<button type="submit" data-id="' + data._id + '" class="btn btn-primary updateButtons">Add</button>' +
						    '</form>' +
						  '</div>' +
						'</div>' +
					'</li>';
}
// END OF MAKE HTML STRING POST FUNCTION

// MAKE HTML STRING COMMENT FUNCTION
function makeHTMLStringComment (data){
	return '<li class="list-group-item">' +
						'<span>' + data.newComment + '<span' +
						'<span id="commentDate">' + new Date() + '<span' +
					'</li>';
}
// END OF MAKE HTML STRING COMMENT FUNCTION
