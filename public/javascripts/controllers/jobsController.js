'use strict';
NUCEScircle.controller("JobsCtrl", function ($scope, $rootScope, $modal, DataService) {

	/**
	 * ng-init for orgjob
	 */
	$scope.getAllOrgJobsData = function () {
		var uri = "/getorgjob/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {

			if (response.result) {
				$scope.jobsByOrg =true;
				$scope.jobOrgData = response.result
			}
			else {
				$scope.jobsByOrg =false;
				$scope.jobOrgData = [{ fullname: response.message }];
			}
		}).error(function (err) {
			console.log(err.message);
		});
	}

	/**
	 * To show Job Applicants List
	 */
	$scope.showApplicants = function () {
		if ($scope.$parent.showApplicantList == true)
			$scope.$parent.showApplicantList = false;
		else
			$scope.$parent.showApplicantList = true;
	}

	/**
	 * ng-init for orgjobApplicants
	 */
	$scope.getOrgJobApplicants = function (jobid) {
		console.log(jobid);
		var uri = "/getorgjobapp/" + jobid;
		DataService.getData(uri, []).success(function (response) {
			console.log("OrgJobsApplicants " + JSON.stringify(response));
			if (response.data) {
				$scope.jobApplicants =true;
				$scope.jobApplicantsData = response.data;
			} else {
				$scope.jobApplicants =false;
				$scope.jobApplicantsData = [{ fullname: response.message }];
			}
		}).error(function (err) {
			console.log(err.message);
		});
	}

	/**
	 * ng-init for userjob
	 */
	$scope.getAllUserJobsData = function () {
		getJobsApplied();
		getJobsRecommended();

	}

	//jobs Applied
	function getJobsApplied() {

		var uri = "/getuserapp/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			console.log(response.data);
			if (response.data) {
				$scope.jobApply =true;
				$scope.jobsApplied = response.data;
			} else {
				$scope.jobApply =false;
				$scope.jobsApplied = [{ title: response.message }];
			}
		}).error(function (err) {
			console.log(err.message);
		});
	}

	//jobs Recommended
	function getJobsRecommended() {
		var uri = "/getrecojobs/" + $rootScope.userid;
		DataService.getData(uri, []).success(function (response) {
			console.log(response.data);
			if (response.data) {
				$scope.jobRecommends =true;
				$scope.jobData = response.data;
			} else {
				$scope.jobRecommends =false;
				$scope.jobData = [{ title: response.message }];
			}
		}).error(function (err) {
			console.log(err.message);
		});
	}

	/**
	 * ng-init for searchJob
	 */
	$scope.getJobSearchData = function () {
		var uri = "/getjob/" + $rootScope.searchedJobId;
		console.log($rootScope.searchedJobId);

		DataService.getData(uri, []).success(function (response) {
			console.log("JobById" + response.data);
			console.log("Stringify JobById" + JSON.stringify(response.data));
			$scope.jobSearchData = response.data;
		}).error(function (err) {
			console.log(err.message);
		});
		$rootScope.searchedJobId = null;
	}

	/**
	 * Modify Jobs Button Callback
	 */
	$scope.modifyJob = function (data) {

		var mdlInstance = $modal.open({
			templateUrl: 'templates/editJobs.html',
			controller: 'EditJobsCtrl',
			size: 'lg',
			resolve: {
				isEdit: function () {
					return data;
				}
			}
		});

		mdlInstance.result.then(function (isValid) {
			if (isValid) {
				//TODO: Fetch all the Jobs details
				$scope.getAllOrgJobsData();
			}
		}, function () {
		});
	};

	/**
	 * Apply Job Button Callback
	 */
	$scope.applyJobs = function (jobid) {
		var params = {
			userid: $rootScope.userid,
			jobid: jobid
		}
		console.log(JSON.stringify(params));
		DataService.postData("/postapp", params).success(function (response) {
			console.log(response.message);
			$scope.getAllUserJobsData();
		}).error(function (err) {
			console.log("Error while posting application");
		});
	};

	/**
	 * Function to get All job details
	 */
	function getJobDetails() {
		DataService.getData("/getjob", []).success(function (response) {
			$scope.jobData = response.result;
		}).error(function (err) {
			console.log(err.message);
		});
	}

});
