'use strict';
NUCEScircle.controller("OrgProfileController", function ($scope, $rootScope, $modal,
	$location, DataService) {

	$scope.getAllData = function () {
		getOrgDetails();
	};

	/**
	 * ng-init for searchOrg
	 */
	$scope.getOrgSearchData = function () {
		var uri = "/getOrgDtls/" + $rootScope.seconduserid;
		DataService.getData(uri, []).success(function (response) {
			//console.log("Org " + response.data);
			$scope.orgProperties = response.data;
		}).error(function (err) {
			console.log(err.message);
		});
	}

	/**
	 * Edit profile button callback
	 */
	$scope.modifyProfile = function () {

		var editProfileModal = $modal.open({
			templateUrl: 'templates/editOrgProfile.html',
			controller: 'EditOrgProfileCtrl',
			size: 'lg',
			resolve: {
				isEdit: function () {
					return $scope.myProperties;
				}
			}
		});

		editProfileModal.result.then(function (isValid) {
			if (isValid) {
				getOrgDetails();
			}
		}, function () {
		});
	};



	/**
	 * Function to get user profile details
	 */
	function getOrgDetails() {
		var uri = "/getOrgDtls/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			$scope.myProperties = response.data;
		}).error(function (err) {
			console.log(err.message);
		});
	}
});