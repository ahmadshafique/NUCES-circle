'use strict';
var NUCEScircle = angular.module("NUcircle", ['ui.router', 'ui.bootstrap'])
NUCEScircle.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider
		//.when()
		.otherwise('/');
	$stateProvider
		.state("index", {
			url: "/",
			templateUrl: "templates/login.html",
			controller: 'LoginController'
		})
		.state("login", {
			url: "/login",
			templateUrl: "templates/login.html",
			controller: 'LoginController'
		})
		.state("logout", {
			url: "/login",
			templateUrl: "templates/login.html",
			controller: 'HomeController'
		})
		.state("home", {
			url: "/home",
			templateUrl: "templates/home.html",
			controller: 'HomeController'
		})
		.state("organisation", {
			url: "/organisation",
			templateUrl: "templates/organisation.html",
			controller: 'HomeController'
		});
	/**
	 * to remove hash in the URL
	 */
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

});
/*
NUCEScircle.run(['$rootScope','$window' ,'$location', 'DataService',function($rootScope,$window, $location,DataService) {
 	$rootScope.$on('$routeChangeStart', function(event) {

 		DataService.postData(urlConstants.IS_LOGGED_IN,[]).success(function(response){

			if($window.sessionStorage.userId){
				$rootScope.userId = $window.sessionStorage.userId;
				$rootScope.userName = $window.sessionStorage.userName;
				if($window.sessionStorage.usertype == "usr")
					$location.path('/home');
				else
					$location.path('/organisation');
			}
			else{
				$location.path('/');
			}

		}).error(function(err){
			if($window.sessionStorage.userId){
				var params = {
						email : $window.sessionStorage.userId
				};
				DataService.postData(urlConstants.LOGOUT, params).success(
						function(response) {
							$location.path('/');
							$window.sessionStorage.userId = undefined;
							$window.sessionStorage.userName = undefined;
						}).error(function(err) {
							console.log("Error while session validity");
						});
			}else{
				$location.path('/');
			}
		});
	});
}]);
*/