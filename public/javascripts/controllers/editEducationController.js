'use strict';
NUCEScircle.controller("EditEducationCtrl", function ($scope, $modalInstance,
	institutions, isEdit, $rootScope, $filter, DataService) {

	/** ******************** */
	if (isEdit) {
		$scope.selectedInstitution = isEdit.school;
		$scope.fromdate = isEdit.startdate;
		$scope.todate = isEdit.enddate;
		$scope.degree = isEdit.degree;
		$scope.deleteOption = true;
	} else {
		$scope.selectedInstitution = "";
		$scope.fromdate = null;
		$scope.todate = null;
		$scope.degree = null;
		$scope.deleteOption = false;
	}

	//$scope.institutions = institutions;

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

	$scope.okay = function () {

		if ($scope.selectedInstitution && $scope.fromdate && $scope.todate && $scope.degree) {

			var school = "";
			if ($scope.selectedInstitution.name) {
				school = $scope.selectedInstitution.name;
			} else {
				school = $scope.selectedInstitution;
			}

			var newDate = new Date($scope.fromdate);
			var formattedFrom = newDate.getDate() + "-" + dataConstants.MONTH_NAMES[newDate.getMonth()] + "-" + newDate.getFullYear();

			var newDate2 = new Date($scope.todate);
			var formattedTo = newDate2.getDate() + "-" + dataConstants.MONTH_NAMES[newDate2.getMonth()] + "-" + newDate2.getFullYear();

			if (isEdit) {

				var params = {
					userid: $rootScope.userid,
					educationid: isEdit.educationid,
					startdate: formattedFrom,
					enddate: formattedTo,
					school: school,
					degree: $scope.degree
				};
				console.log(JSON.stringify(params));
				DataService.putData("/edudtls", params)
					.success(function (response) {
						$modalInstance.close(true);
					}).error(function (err) {
						$scope.formError = "update failed !!!";
						//$modalInstance.dismiss(false);
					});

			} else {

				var params = {
					userid: $rootScope.userid,
					startdate: formattedFrom,
					enddate: formattedTo,
					school: school,
					degree: $scope.degree
				};
				DataService.postData("/edudtls", params)
					.success(function (response) {
						$modalInstance.close(true);
					}).error(function (err) {
						$scope.formError = "form Invalid !!!";
						//$modalInstance.dismiss(false);
					});
			}
		} else {
			$scope.formError = "form Invalid !!!";
			//$modalInstance.dismiss(false);
		}
	};

	$scope.deleteCall = function () {
		var params = {
			userid: $rootScope.userid,
			educationid: isEdit.educationid
		}
		console.log(JSON.stringify(params));
		DataService.deleteData("/edudtls", params).success(function (response) {
			$modalInstance.close(true);
		}).error(function (err) {
			$scope.formError = "delete failed !!!";
			//$modalInstance.dismiss(false);
		});
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

});
