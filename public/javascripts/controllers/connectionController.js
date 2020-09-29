'use strict';
NUCEScircle.controller("ConnectionCtrl", function ($scope, $rootScope, DataService) {

	$scope.getAllData = function () {
		console.log("getAllConnectionData Getting called");

		getUserConnectionRequestsReceived();
		getAllConnections();
		getUserConnectionRequestsSent();
		getUnConnected();
	}

	//approved=0 received
	function getUserConnectionRequestsReceived() {
		var uri = "/connect/requestsReceived/" + $rootScope.userid;
		DataService.getData(uri, []).success(
			function (response) {
				console.log("userConnectionRequestsReceived: " + JSON.stringify(response));
				if (response.data) {
					$scope.requestsReceived =true;
					$scope.userConnectionRequestsReceived = response.data;
				} else {
					$scope.requestsReceived =false;
					$scope.userConnectionRequestsReceived = [{ fullname: response.message }];
				}
			}).error(function (err) {
				console.log("Error while fetching pending requests");
			});
	}

	//approved=1
	function getAllConnections() {
		var uri = "/connect/approved/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			console.log("connectedList: " + JSON.stringify(response));
			if (response.data) {
				$scope.connected =true;
				$scope.connectedList = response.data;
			} else {
				$scope.connected =false;
				$scope.connectedList = [{ fullname: response.message }];
			}
		}).error(function (err) {
			console.log("Error while fetching approved requests");
		});
	};

	//approved=0 sent
	function getUserConnectionRequestsSent() {
		var uri = "/connect/requestsSent/" + $rootScope.userid;
		DataService.getData(uri, []).success(
			function (response) {
				console.log("userConnectionRequestsSent: " + JSON.stringify(response));
				if (response.data) {
					$scope.requestsSent =true;
					$scope.userConnectionRequestsSent = response.data;
				} else {
					$scope.requestsSent =false;
					$scope.userConnectionRequestsSent = [{ fullname: response.message }];
				}
			}).error(function (err) {
				console.log("Error while fetching requests sent");
			});
	}

	//user recommendation
	function getUnConnected() {
		var uri = "/notconnected/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			console.log("unconnectedList: " + JSON.stringify(response));
			if (response.data) {
				$scope.connectRecommends =true;
				$scope.unconnectedList = response.data;
			} else {
				$scope.connectRecommends =false;
				$scope.unconnectedList = [{ fullname: response.message }];
			}
		}).error(function (err) {
			console.log("Error while fetching approved requests");
		});
	};

	$scope.connectUsers = function (seconduserid) {
		var params = {
			userid: $rootScope.userid,
			secuserid: seconduserid
		};
		DataService.postData("/connect", params).success(function (response) {
			console.log("request sent success" + params.userid + " " + params.secuserid);
			$scope.getAllData();
		}).error(function (err) {
			console.log("request sent failure" + params.userid + " " + params.secuserid);
			console.log(err.message);
		});
	}

	$scope.disconnectUsers = function (seconduserid) {
		var params = {
			userid: $rootScope.userid,
			secuserid: seconduserid
		};

		DataService.deleteData("/connect", params).success(function (response) {
			console.log("disconnect success" + params.userid + " " + params.secuserid);
			$scope.getAllData();
		}).error(function (err) {
			console.log("disconnect failure" + userid + " " + params.secuserid);
			console.log(err.message);
		});
	}

	$scope.acceptRequest = function (seconduserid) {

		var params = {
			userid: $rootScope.userid,
			secuserid: seconduserid
		};

		DataService.postData("/connect/accept", params).success(function (response) {
			console.log("accept success" + params.userid + " " + params.secuserid);
			$scope.getAllData();
		}).error(function (err) {
			console.log("accept failure" + params.userid + " " + params.secuserid);
			console.log(err.message);
		});
	}

	$scope.cancelRequest = function (seconduserid) {
		$scope.disconnectUsers(seconduserid);
	}

});
