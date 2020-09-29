'use strict';
NUCEScircle.controller("EditOrgProfileCtrl", function ($scope, $modalInstance, isEdit, $rootScope, DataService, $window) {
	//console.log("isEdit: " + isEdit + ":: typeof isEdit: "+ (typeof isEdit));
	if (isEdit) {
		$scope.motto = isEdit.motto;
		$scope.url = isEdit.url;
		$scope.overview = isEdit.overview;
	} else {
		$scope.motto = "";
		$scope.url = "";
		$scope.overview = "";
	}

	$scope.okay = function () {
		if ($scope.motto === "" || $scope.url === "" || $scope.overview === "") {
			$scope.formError = "Form Invalid !!!";
		} else {

			var params = {
				userid: $rootScope.userid,
				email: $rootScope.email,
				motto: $scope.motto,
				url: $scope.url,
				overview: $scope.overview
			};

			DataService.putData("/saveOrgDtls", params).success(function (response) {

				$modalInstance.close(true);
			}).error(function (err) {
				$scope.formError = "form Invalid !!!";
				//$modalInstance.close(false);
			});
		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss(false);
	};
});
