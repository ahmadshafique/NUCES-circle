'use strict';
NUCEScircle.controller("EditJobsCtrl", function ($scope, $modalInstance, isEdit, $rootScope, DataService, $window) {

	/** ******************** */
	if (isEdit) {
		$scope.title = isEdit.title;
		$scope.location = isEdit.location;
		$scope.fromdate = isEdit.fromdate;
		$scope.todate = isEdit.todate;
		$scope.details = isEdit.detailslink;
		$scope.deleteOption = true;
	} else {
		$scope.title = "";
		$scope.location = "";
		$scope.fromdate = null;
		$scope.todate = null;
		$scope.details = "";
		$scope.deleteOption = false;
	}

	$scope.today = new Date();

	$scope.dateOptions = {
		formatYear: 'yyyy',
		startingDay: 1
	};
	$scope.datepickers = {
		from: false,
		to: false
	};
	/** ******************** */

	/*
	 * DatePicker open Callback
	 */
	$scope.open = function ($event, which) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.datepickers[which] = true;
	};

	/**
	 * Save Job Button Callback
	 */
	$scope.okay = function () {
		if ($scope.title === "" || $scope.location === "" || $scope.fromdate === ""  || $scope.todate === "") {
			$scope.formError = "Form Invalid !!!";
		} else {

			var newDate = new Date($scope.fromdate);
			var formattedFrom = newDate.getDate() + "-" + dataConstants.MONTH_NAMES[newDate.getMonth()] + "-" + newDate.getFullYear();

			var newDate2 = new Date($scope.todate);
			var formattedTo = newDate2.getDate() + "-" + dataConstants.MONTH_NAMES[newDate2.getMonth()] + "-" + newDate2.getFullYear();

			if (isEdit) {

				var params = {
					userid: $rootScope.userid,
					jobid: isEdit.jobid,
					title: $scope.title,
					location: $scope.location,
					fromdate: formattedFrom,
					todate: formattedTo,
					details: $scope.details
				};
				//console.log(JSON.stringify(params));

				DataService.putData("/updatejob", params)
					.success(function (response) {
						$modalInstance.close(true);
					}).error(function (err) {
						$scope.formError = "update failed !!!";
						//$modalInstance.dismiss(false);
					});

			} else {

				var params = {
					userid: $rootScope.userid,
					title: $scope.title,
					location: $scope.location,
					fromdate: formattedFrom,
					todate: formattedTo,
					details: $scope.details
				};
				//console.log(JSON.stringify(params));

				DataService.postData("/postjob", params)
					.success(function (response) {
						$modalInstance.close(true);
					}).error(function (err) {
						$scope.formError = "Form Invalid !!!";
						//$modalInstance.dismiss(false);
					});
			}
		}
	};

	/**
	 * Delete Job Button Callback
	 */
	$scope.deleteCall = function (data) {
		var params = {
			userid: $rootScope.userid,
			jobid: isEdit.jobid
		}
		console.log(JSON.stringify(params));
		DataService.deleteData("/deletejob", params).success(function (response) {
			$modalInstance.close(true);
			$scope.getAllOrgJobsData();
		}).error(function (err) {
			$scope.formError = "delete failed !!!";
			//$modalInstance.close(false);
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss(false);
	};
});
