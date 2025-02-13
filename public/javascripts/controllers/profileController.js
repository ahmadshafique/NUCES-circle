'use strict';
NUCEScircle.controller("ProfileController", function ($scope, $rootScope, $modal,
	$location, DataService) {

	$scope.getAllData = function () {
		//console.log("Getting called");
		getUserDetails();
		getEmploymentList();
		getEducationList();
		getSkillsList();

		/**
		 * Getting List of Companies for adding experience 
		 */
		DataService.getData("/organisations", []).success(
			function (response) {
				$scope.companies = response.data;
			}).error(function (err) {
				console.log("Error while fetching data");
			});

		/**
		 * Getting List of Institutions for adding education 
		 */
		DataService.getData("/institutions", []).success(
			function (response) {
				$scope.institutions = response.data;
			}).error(function (err) {
				console.log("Error while fetching data");
			});

		/**
		 * Getting List of Skills for adding skills 
		 */
		DataService.getData("/skills", []).success(
			function (response) {
				$scope.skills = response.data;
			}).error(function (err) {
				console.log("Error while fetching data");
			});
	}


	/**
	 * Add Employment Button Callback
	 */
	$scope.modifyEmployment = function (data) {

		var modalInstance = $modal.open({
			templateUrl: 'templates/editEmployment.html',
			controller: 'EditEmploymentCtrl',
			size: 'lg',
			resolve: {
				companies: function () {
					return $scope.companies;
				},
				isEdit: function () {
					return data;
				}
			}
		});

		modalInstance.result.then(function (isValid) {
			if (isValid) {
				getEmploymentList();
			}
		}, function () {
		});
	};


	/**
	 * Add Education Button Callback
	 */
	$scope.modifyEducation = function (data) {

		var educationInstance = $modal.open({
			templateUrl: 'templates/editEducation.html',
			controller: 'EditEducationCtrl',
			size: 'lg',
			resolve: {
				institutions: function () {
					return $scope.institutions;
				},
				isEdit: function () {
					return data;
				}
			}
		});

		educationInstance.result.then(function (isValid) {
			if (isValid) {
				getEducationList();
			}
		}, function () {
		});
	};


	/**
	 * Add Education Button Callback
	 */
	$scope.modifySkills = function () {

		var skillsInstance = $modal.open({
			templateUrl: 'templates/editSkills.html',
			controller: 'EditSkillsCtrl',
			size: 'lg',
			resolve: {
				skills: function () {
					return $scope.skills;
				}
			}
		});

		skillsInstance.result.then(function (isValid) {
			if (isValid) {
				getSkillsList();
			}
		}, function () {
		});
	};

	/**
	 * Edit profile button callback
	 */
	$scope.modifyProfile = function () {

		var editProfileModal = $modal.open({
			templateUrl: 'templates/editProfile.html',
			controller: 'EditProfileCtrl',
			size: 'lg',
			resolve: {
				isEdit: function () {
					return $scope.myProperties;
				}
			}
		});

		editProfileModal.result.then(function (isValid) {
			if (isValid) {
				getUserDetails();
			}
		}, function () {
		});
	};

	/**
	 * Function to get user profile details
	 */
	function getUserDetails() {
		var uri = "/userdtls/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			$scope.myProperties = response.data;
		}).error(function (err) {
			console.log(err.message);
		});
	}


	/**
	 * Function for getting Employment data for the user
	 */
	function getEmploymentList() {
		var uriEmployment = "/expdtls/" + $rootScope.userid;
		DataService.getData(uriEmployment, []).success(function (response) {
			$scope.employmentData = response.data;
		}).error(function (err) {
			console.log(err);
		});
	}

	/**
	 * Function for getting Education data for the user
	 */
	function getEducationList() {
		var uriEducation = "/edudtls/" + $rootScope.userid;
		DataService.getData(uriEducation, []).success(function (response) {
			$scope.educationData = response.data;
		}).error(function (err) {
			console.log(err);
		});
	}

	/**
	 * Function for getting Skills data for the user
	 */
	function getSkillsList() {
		var uriSkills = "/skills/" + $rootScope.userid;
		DataService.getData(uriSkills, []).success(function (response) {
			$scope.skillsData = response.data;
		}).error(function (err) {
			console.log(err);
		});
	}

});