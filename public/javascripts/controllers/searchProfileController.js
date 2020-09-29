'use strict';
NUCEScircle.controller('SearchProfileController', function ($scope, DataService, $rootScope) {

	/**
	 * ng-init
	 */
	$scope.getResultData = function () {
		console.log("userid " + $rootScope.userid);
		console.log("seconduserid " + $rootScope.seconduserid);
		console.log("scope seconduserid " + $scope.seconduserid);

		getUserDetails();
		getEmploymentList();
		getEducationList();
		getSkillsList();

		if ($rootScope.usertype == 'usr') {
			$scope.searchByUser = true;
			getConnection();
		} else {
			$scope.searchByUser = false;
		}
	}

	/**
	 * Function to get user profile details
	 */
	function getUserDetails() {
		var uri = "/userdtls/" + $scope.seconduserid;
		DataService.getData(uri, []).success(function (response) {
			$scope.userProperties = response.data;
		}).error(function (err) {
			console.log(err.message);
		});
	}

	/**
	 * Function for getting Employment data for the user
	 */
	function getEmploymentList() {
		var uri = "/expdtls/" + $scope.seconduserid;
		DataService.getData(uri, []).success(function (response) {
			$scope.userEmploymentData = response.data;
		}).error(function (err) {
			console.log(err);
		});
	}

	/**
	 * Function for getting Education data for the user
	 */
	function getEducationList() {
		var uri = "/edudtls/" + $scope.seconduserid;
		DataService.getData(uri, []).success(function (response) {
			$scope.userEducationData = response.data;
		}).error(function (err) {
			console.log(err);
		});
	}

	/**
	 * Function for getting Skills data for the user
	 */
	function getSkillsList() {
		var uri = "/skills/" + $scope.seconduserid;
		DataService.getData(uri, []).success(function (response) {
			$scope.userSkillsData = response.data;
		}).error(function (err) {
			console.log(err);
		});
	}

	/**
	 * Function for checking connection
	 */
	function getConnection() {

		var uri = "/connect/" + $rootScope.userid + "/" + $scope.seconduserid;
		DataService.getData(uri, []).success(function (response) {
			if (response.con == 0) {
				$scope.isConnected = false;
				$scope.connectionStatus = "Not Connected";
			} else if (response.con == 1) {
				$scope.isConnected = "pending";
				$scope.connectionStatus = "Request Pending";
			} else {
				$scope.isConnected = true;
				$scope.connectionStatus = "Connected";
			}
		}).error(function (err) {
			console.log(err);
		});
	}

	$scope.connectUsers = function () {
		console.log($rootScope.userid);
		var params = {
			userid: $rootScope.userid,
			secuserid: $scope.seconduserid
		};

		DataService.postData("/connect", params).success(function (response) {
			$scope.isConnected = "pending";
			$scope.connectionStatus = "Request Pending";
		}).error(function (err) {
			$scope.connectionStatus = err.message;
		});
	}

	$scope.cancelConnectUsers = function () {
		var params = {
			userid: $rootScope.userid,
			secuserid: $scope.seconduserid
		};

		DataService.deleteData("/connect", params).success(function (response) {
			$scope.isConnected = false;
			$scope.connectionStatus = "Not Connected";
		}).error(function (err) {
			$scope.connectionStatus = err.message;
		});
	}

	$scope.disconnectUsers = function () {
		var params = {
			userid: $rootScope.userid,
			secuserid: $scope.seconduserid
		};

		DataService.deleteData("/connect", params).success(function (response) {
			$scope.isConnected = false;
			$scope.connectionStatus = "Not Connected";
		}).error(function (err) {
			$scope.connectionStatus = err.message;
		});
	}
});