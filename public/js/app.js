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
			alert('Oopsie! You need to type some words before we can create your Brain Dump...');
		}
	});
	// END OF CREATE NEW POST

	// DELETE POST
	// on click of .delete form
	$('#post-ul').on('click', '.delete', function(e) {
		e.preventDefault();
		console.log("delete button clicked");
		// decrease post count and update #count html
		postCount = postCount - 1;
		$("#count").html(postCount + ' posts');

		// find id of .delete button
		var deletePostId = $(this).data().id;
		console.log(deletePostId);
		// define what it is going to delete
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
	$(document).on('click', '.updateButtons', function(e) {
		e.preventDefault();
		console.log("newComment form submitted");
		console.log($(this).siblings().serialize());
		var correctId = $(this).attr('data-id');
		console.log(correctId);

		// check input not empty
		if ($("#newCommentInput").val().trim().length > 0) {
			// ajax post to server
			$.ajax({
				url: "/api/comments",
				type: "POST",
				data: $(this).siblings().serialize()
			}).done(function(data) {
					// change comment's _id so equal to post's _id
					console.log(data);
					data._id = correctId;
					console.log(data);
					// turn serialized data into string
					var commentHTML = makeHTMLStringComment(data);
					// find correct list and prepend comment
					var correctComment = $('.comment-ul[data-id="' + correctId + '"]');
					correctComment.prepend(commentHTML + currentDateTime + " " + currentDateDate);
					// clear form
					$("#newCommentInput").val('');
					// give focus back to #newPostInput
					$("#newCommentInput").focus();
			}).fail(function(data){
					console.log("comment form did not post to server");
			});
		}
		else {
			alert('Oopsie! You need to type some words before we can create your comment...');
		}
	});
	// END OF CREATE NEW COMMENT

	// GET SINGLE PAGE VIEW
/*  This is unnecessary since the button can just link directly to the page
//  This is no longer a single-page-app 
	$(document).on('click', '.linkButtons', function(e){
		e.preventDefault();
		console.log('link button clicked');
		// get relevant _id
		var singlePostId = $(this).siblings().attr('data-id');
		console.log(singlePostId);

		// ajax get to server
		$.ajax({
			url: "/posts/" + singlePostId,
			type: "GET",
		}).done(function(data){
			console.log('singlepost get request sent');
		}).fail(function(data){
			console.log('singlepost get request failed');
		});
	});
*/

}); // END OF DOC READY



// MAKE HTML STRING POST FUNCTION
function makeHTMLStringPost (data){
	return '<li class="list-group-item">' +
						data.newPost +
						'<button type="button" data-id="' + data._id + '" class="delete btn btn-default btn-sm"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>' +
						'<br>' +
						'<button class="btn btn-primary commentButtons" type="button" data-toggle="collapse" data-target="#toggle' + data._id + '" aria-expanded="false" aria-controls="toggle' + data._id + '">' +
						  'Comments' +
						'</button>' +
						'<button class="btn btn-success linkButtons" type="button" >Single page view</button>' +
						'<div class="collapse" id="toggle' + data._id + '">' +
						  '<div class="well">' +
						    '<form data-id="' + data._id + '" class="form-group newComment">' +
						      '<input type="text" id="newCommentInput" name="newComment" class="form-control" placeholder="Comments...">' +
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
	return '<li class="list-group-item">' +
						'<span>' + data.newComment + '</span>' +
					'</li>';
}
// END OF MAKE HTML STRING COMMENT FUNCTION
