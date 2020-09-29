'use strict';
NUCEScircle.controller("HomeController", function ($scope, $location, DataService, $rootScope) {

	$scope.loadData = function () {
		if ($rootScope.usertype == 'usr') {
			$scope.templateView = "templates/profile.html";
		} else if ($rootScope.usertype == 'org') {
			$scope.templateView = "templates/orgprofile.html";
		}

		$scope.showTabData = true;
		$scope.selectedInput = undefined;
		$scope.userDropdownOptions = ['Logout'];

		$scope.searchData('');
	}

	$scope.userDropdownSelected = function (optionSelected) {
		if (optionSelected === "Logout") {
			DataService.postData("/logout", [$rootScope.userid]).success(
				function (response) {
					$location.path('/logout');
				}).error(function (err) {
					console.log("Error while session validity");
				});
		}
	}

	$scope.tabActive = function (tabName) {
		$scope.selectedInput = "";
		$scope.showTabData = true;
		$scope.templateView = "templates/" + tabName + ".html";
	}

	$scope.getTemplate = function () {
		return $scope.templateView;
	}

	$scope.searchData = function (searchQuery) {

		//console.log(searchQuery);
		var params = {
			query: searchQuery
		}

		DataService.postData('/search', params).success(function (response) {
			$scope.searchInputs = response.data;
			//console.log("search results: " + JSON.stringify(response.data));
		}).error(function (err) {
			console.log(err.message + "Error while fetching search user+organization+job data");
		});
	}

	$scope.showSearchResult = function () {
		if ($scope.selectedInput) {
			if ($scope.selectedInput.name !== $rootScope.userName) {
				$scope.showTabData = false;
				$scope.userid = $rootScope.userid;
				//console.log($scope.userid + $rootScope.userid);
				console.log("Selected Input: " + JSON.stringify($scope.selectedInput));
				if ($scope.selectedInput.type == "job") {
					$rootScope.searchedJobId = $scope.selectedInput.userid;
					$scope.$parent.showUserResult = false;
					$scope.$parent.showOrgResult = false;
					$scope.$parent.showJobsResult = true;
				} else if ($scope.selectedInput.type == "usr") {
					$rootScope.seconduserid = $scope.selectedInput.userid;
					$scope.$parent.showUserResult = true;
					$scope.$parent.showOrgResult = false;
					$scope.$parent.showJobsResult = false;
				} else if ($scope.selectedInput.type == "org") {
					$rootScope.seconduserid = $scope.selectedInput.userid;
					$scope.$parent.showUserResult = false;
					$scope.$parent.showOrgResult = true;
					$scope.$parent.showJobsResult = false;
				}
				console.log("$scope.$parent.showUserResult: " + $scope.$parent.showUserResult);
				console.log("$scope.$parent.showOrgResult: " + $scope.$parent.showOrgResult);
				console.log("$scope.$parent.showJobResult: " + $scope.$parent.showJobsResult);
			}
		}
	}

});