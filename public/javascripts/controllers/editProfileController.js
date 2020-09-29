'use strict';
NUCEScircle.controller("EditProfileCtrl", function ($scope, $modalInstance, isEdit, $rootScope, DataService, $window) {

	$scope.firstName = isEdit.firstname;
	$scope.lastName = isEdit.lastname;
	$scope.headline = isEdit.headline;
	$scope.dob = isEdit.dob;
	$scope.summary = isEdit.summary;

	$scope.today = new Date();

	$scope.dateOptions = {
		formatYear: 'yyyy',
		startingDay: 1
	};

	$scope.open = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};


	$scope.okay = function () {
		if ($scope.firstName === "" || $scope.lastName === "" || $scope.headline === "" || $scope.dob === "" || $scope.headline === "--" || $scope.dob === "--") {
			$scope.formError = "Form Invalid !!!";
		} else {
			var newDate = new Date($scope.dob);
			var formattedDOB = newDate.getDate() + "-" + dataConstants.MONTH_NAMES[newDate.getMonth()] + "-" + newDate.getFullYear();

			var params = {
				userid: $rootScope.userid,
				email: $rootScope.email,
				firstName: $scope.firstName,
				lastName: $scope.lastName,
				headline: $scope.headline,
				dob: formattedDOB,
				summary: $scope.summary
			};

			DataService.putData("/userdtls", params).success(function (response) {
				$window.sessionStorage.userName = $scope.firstName + " " + $scope.lastName;
				$rootScope.userName = $scope.firstName + " " + $scope.lastName;

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
