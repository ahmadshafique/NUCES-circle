'use strict';
NUCEScircle.controller("EditSkillsCtrl", function ($scope, $modalInstance, skills, $rootScope, DataService) {
	$scope.selectedSkill = "";
	//$scope.skills = skills;

	$scope.okay = function () {

		if ($scope.selectedSkill) {
			var params = {
				userid: $rootScope.userid,
				skillname: $scope.selectedSkill
			};
			console.log(JSON.stringify(params));
			DataService.postData("/skills", params)
				.success(function (response) {
					$modalInstance.close(true);
				}).error(function (err) {
					$scope.formError = "form Invalid !!!";
					//$modalInstance.dismiss(false);
				});
		} else {
			$scope.formError = "Form Invalid !!!";
		}
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});