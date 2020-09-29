'use strict';
NUCEScircle.controller("SignUpController", function ($scope, $rootScope, $location, $window,
	DataService) {
	$rootScope.formError = "";
	$scope.usertype = "usr";

	$scope.signUp = function () {

		if ($scope.usertype == "usr") {
			if ($scope.signUpForm.firstName.$invalid
				|| $scope.signUpForm.lastName.$invalid
				|| $scope.signUpForm.email.$invalid
				|| $scope.signUpForm.pwd.$invalid
				|| $scope.signUpForm.pwdconfirm.$invalid) {
				$rootScope.formError = "Form invalid. Please fill it again.";
				return;
			}

		} else {
			if ($scope.signUpForm.orgname.$invalid
				|| $scope.signUpForm.email.$invalid
				|| $scope.signUpForm.pwd.$invalid
				|| $scope.signUpForm.pwdconfirm.$invalid) {
				$rootScope.formError = "Form invalid. Please fill it again.";
				return;
			}
		}

		$rootScope.formError = "";
		var params = {
			firstName: $scope.firstName,
			lastName: $scope.lastName,
			usertype: $scope.usertype,
			orgname: $scope.orgname,
			email: $scope.email,
			password: $scope.pwd,
			passwordconfirm: $scope.pwdconfirm
		}

		//console.log(JSON.stringify(params));
		DataService.postData("/register", params).success(
			function (response) {
				$window.sessionStorage.userid = response.userid;
				$window.sessionStorage.email = response.email;
				$window.sessionStorage.userName = response.name;
				$window.sessionStorage.usertype = response.usertype;
				$rootScope.userid = response.userid;
				$rootScope.usertype = response.usertype;
				$rootScope.email = response.email;
				$rootScope.userName = response.name;
				if ($rootScope.usertype == 'usr') {
					$location.path('/home');
				} else if ($rootScope.usertype == 'org') {
					$location.path('/organisation');
				}
			}).error(function (err) {
				console.log(err);
				$rootScope.formError = err.message;
			});
	}

});