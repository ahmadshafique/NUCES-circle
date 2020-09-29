'use strict';
NUCEScircle.controller("LoginController", function ($scope, $rootScope,
	$location, $window, DataService) {

	$scope.signIn = function () {
		if ($scope.loginForm.userID.$invalid || $scope.loginForm.password.$invalid) {
			$rootScope.formError = "Invalid Credentials";
		} else {

			$rootScope.formError = "";
			var params = {
				email: $scope.userID,
				password: $scope.password
			};
			DataService.postData("/login", params).success(
				function (response) {
					//For encrypting password at client side as well
					//$scope.password = CryptoJS.SHA256($scope.password).toString(CryptoJS.enc.hex);
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
	}

	// $scope.linkedInAuth = function(){
	// 	$window.location="/auth/linkedin";
	// }
});