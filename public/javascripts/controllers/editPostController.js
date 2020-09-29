'use strict';
NUCEScircle.controller("EditPostCtrl", function ($scope, $modalInstance,
	isEdit, $rootScope, $filter, DataService) {

	/***********************/
	
	$scope.postbody = isEdit.postbody;
	$scope.deleteOption = true;

	/** ******************** */

	$scope.ok = function () {
		if ($scope.postbody) {

			var params = {
				postid: isEdit.postid,
				postbody: $scope.postbody
			};

			DataService.putData("/updatePost", params)
				.success(function (response) {
					$modalInstance.close(true);
				}).error(function (err) {
					$scope.formError = "update failed !!!";
					//$modalInstance.dismiss(false);
				});
		
		} else {
			$scope.formError = "Post Body is Empty !!!";
		}
	};

	$scope.deleteCall = function () {
		var params = {
			postid: isEdit.postid
		};

		DataService.deleteData("/deletePost", params).success(function (response) {
			$modalInstance.close(true);
		}).error(function (err) {
			$scope.formError = "delete failed !!!";
			//$modalInstance.dismiss(false);
		});
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

});
