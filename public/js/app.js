//CLIENT SIDE JS

$(document).ready(function() {
	console.log("test");

	// find todays date and append to headerDate div
	var currentDate = new Date();
	var currentDateTime = $.format.date(currentDate, 'H:mm');
	var currentDateDate = $.format.date(currentDate, 'ddd d MMM');

	$("#headerDate").append(currentDateTime + '<hr>' + currentDateDate);

	// find starting post count and create integer
	var postCount = $('#count').html();
	postCount = parseInt(postCount);

	// CREATE NEW POST
	// on submit of #newPost form
	$('#newPost').submit(function(e) {
		e.preventDefault();
		console.log("newPost form submitted");

		// check input not empty
		if ($("#newPostInput").val().trim().length > 0) {
			// increase post count and update #count html
			postCount = postCount + 1;
			$("#count").html(postCount + " posts");
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
		}
		else {
			$("#empty").modal();
		}
	});
	// END OF CREATE NEW POST

	// DELETE POST
	// on click of .delete form
	$('#post-ul').on('click', '.deletePost', function(e) {
		e.preventDefault();
		console.log("delete post button clicked");
		// decrease post count and update #count html
		postCount = postCount - 1;
		$("#count").html(postCount + ' posts');

		// find id of .deletePost button
		var deletePostId = $(this).data().id;
		console.log(deletePostId);
		// define what it is going to delete
		var deletePost = $(this).closest('li');

		// ajax post to server
		$.ajax({
			url: "/api/posts/" + deletePostId,
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
	$(document).on('click', '.updateButtons', function(e) {
		e.preventDefault();
		console.log("newComment form submitted");
		// find Id of post
		var postId = $(this).attr('data-id');
		console.log(postId);

		// check input not empty
		console.log($(this).siblings().serialize());
		if ($(this).siblings().val().trim().length > 0) {
			// ajax post to server
			$.ajax({
				url: "/api/posts/" + postId + "/comments",
				type: "POST",
				data: $(this).siblings().serialize()
			}).done(function(data) {
					// find correct comment in post object and turn into string
					var correctCommentIndex = data.comments.length - 1;
					var commentHTML = makeHTMLStringComment(data.comments[correctCommentIndex]);
					// find correct list and prepend comment
					var correctPost = $('.comment-ul[data-id="' + postId + '"]');
					correctPost.prepend(commentHTML);
					// clear form
					$(".newCommentInput").val('');
					// give focus back to #newPostInput
					$(".newCommentInput").focus();
			}).fail(function(data){
					console.log("comment form did not post to server");
			});
		}
		else {
			$("#empty").modal();
		}
	});
	// END OF CREATE NEW COMMENT

}); // END OF DOC READY



// MAKE HTML STRING POST FUNCTION
function makeHTMLStringPost (data){
	return '<li class="list-group-item">' +
						data.newPost +
						'<button type="button" data-id="' + data._id + '" class="deletePost btn btn-default btn-sm"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>' +
						'<br>' +
						'<button class="btn btn-primary commentButtons" type="button" data-toggle="collapse" data-target="#toggle' + data._id + '" aria-expanded="false" aria-controls="toggle' + data._id + '">' +
						  'Comments' +
						'</button>' +
						'<button class="btn btn-success linkButtons" type="button" >Single page view</button>' +
						'<div class="collapse" id="toggle' + data._id + '">' +
						  '<div class="well">' +
						    '<form data-id="' + data._id + '" class="form-group newComment">' +
						      '<input type="text" name="newComment" class="form-control newCommentInput" placeholder="Comments...">' +
						      '<button type="submit" data-id="' + data._id + '" class="btn btn-primary updateButtons">Add</button>' +
						    '</form>' +
						    '<ul data-id="' + data._id + '" class="list-group comment-ul">' +
						    '</ul>' +
						  '</div>' +
						'</div>' +
					'</li>';
}
// END OF MAKE HTML STRING POST FUNCTION

// MAKE HTML STRING COMMENT FUNCTION
function makeHTMLStringComment (data){
	return '<li class="list-group-item" data-id="' + data._id + '">' +
						'<span>' + data.newComment + '</span>' +
						'<button type="button" data-id="' + data._id + '" class="deleteComment btn btn-default btn-sm"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>' +
					'</li>';
}
// END OF MAKE HTML STRING COMMENT FUNCTION
