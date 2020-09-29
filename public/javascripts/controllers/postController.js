NUCEScircle.controller('postController', function ($scope, $rootScope, $modal, DataService) {

	$scope.submitpost = function () {

		var params = {
			postbody: $scope.postbody,
			userid: $rootScope.userid
		}
		//console.log(params);
		DataService.postData("/savePost", params).success(function (response) {
			console.log("success save post");
			$scope.postbody = "";
			$scope.showHomePosts();
		}).error(function (error) {
			console.log("error save post");
		});
	};

	$scope.modifyPost = function(post){

		var postInstance = $modal.open({
			templateUrl: 'templates/editPost.html',
			controller: 'EditPostCtrl',
			size: 'lg',
			resolve: {
				isEdit: function () {
					return post;
				}
			}
		});

		postInstance.result.then(function (isValid) {
			if (isValid) {
				$scope.showHomePosts();
			}
		}, function () {
		});

	}

	/*
	*	Home Posts Show 
	*/

	//Declaration
	var postsCount = 0;
	var pageNo = 0;
	var pageSize = 10;
	$scope.posts = [];

	/*
	* Home posts init
	*/
	$scope.showHomePosts = function() {
		postsCount = 0;
		pageNo = 0;
		pageSize = 10;
		$scope.posts = [];
		getPostsCount();
		getNextPagePosts()
	}

	function getPostsCount(){

		var uri = "/userPostsCount/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			console.log("success posts count")
			postsCount = response.count;
			//console.log(postsCount);
		}).error(function (error) {
			console.log("error posts count");
		});
	}

	function getNextPagePosts(){

		var uri = "/pagePosts/" + $rootScope.userid + "/" + pageNo + "/" + pageSize; 
		DataService.getData(uri, []).success(function (response) {
			console.log("success next page posts")
			var items = response.data;
			for (var i = 0; i < items.length; i++)
				$scope.posts.push(items[i]);
			pageNo += items.length;
			pageSize += pageSize;
			
			//console.log(items);
			//console.log($scope.posts);
		}).error(function (error) {
			console.log("error next page posts");
		});
	};

	$scope.getAllPosts = function () {
		uri = '/userAllPosts/' + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			console.log("success all posts")
			$scope.posts = response.data;
			//console.log(JSON.stringify(response.data));
		}).error(function (error) {
			console.log("error all posts");
		});
	};

	$(window).scroll(function () {
		if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {

			if (pageNo<postsCount) {
				getNextPagePosts();
			} else {
				$('#posts').append(

					"<article class='post'>" +
					"<label class='text-primary'>User Name</label>" +
					"<div class='text-justify'>" +
					"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure itaque esse odit" +
					"asperiores tempora quis sapiente ut delectus nemo quisquam, amet pariatur qui" +
					"voluptate, sunt provident. Ducimus natus repellendus animi!" +
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quibusdam eaque" +
					"nostrum quia fuga, sunt asperiores eum debitis enim, quaerat inventore quis" +
					"architecto eius, fugit aliquam magni doloribus soluta ipsa?" +
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem voluptas iusto" +
					"nulla nihil officia officiis quis doloribus ea earum quidem cumque, aut" +
					"architecto debitis illum iste asperiores aspernatur facilis magni?" +
					"</div>" +
					"</article>" +
					"</br>" +
					"</br>"
					);
			}

		}
	});

});

