'use strict';
NUCEScircle.controller("EditEmploymentCtrl", function ($scope, $modalInstance,
	companies, isEdit, $rootScope, $filter, DataService) {

	/***********************/
	if (isEdit) {
		$scope.selectedCompany = isEdit.companyname;
		$scope.fromdate = isEdit.startdate;
		$scope.todate = isEdit.enddate;
		$scope.designation = isEdit.title;
		$scope.deleteOption = true;
	} else {
		$scope.selectedCompany = "";
		$scope.fromdate = null;
		$scope.todate = null;
		$scope.designation = null;
		$scope.deleteOption = false;
	}

	//$scope.companies = companies;

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
		if ($scope.selectedCompany && $scope.fromdate && $scope.todate && $scope.designation) {
			var company = "";
			if ($scope.selectedCompany.name) {
				company = $scope.selectedCompany.name;
			} else {
				company = $scope.selectedCompany;
			}

			var newDate = new Date($scope.fromdate);
			var formattedFrom = newDate.getDate() + "-" + dataConstants.MONTH_NAMES[newDate.getMonth()] + "-" + newDate.getFullYear();

			var newDate2 = new Date($scope.todate);
			var formattedTo = newDate2.getDate() + "-" + dataConstants.MONTH_NAMES[newDate2.getMonth()] + "-" + newDate2.getFullYear();

			if (isEdit) {

				var params = {
					userid: $rootScope.userid,
					experienceid: isEdit.experienceid,
					startdate: formattedFrom,
					enddate: formattedTo,
					companyname: company,
					title: $scope.designation
				};
	
				console.log(params);
				DataService.putData("/expdtls", params)
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
					companyname: company,
					title: $scope.designation
				};

				DataService.postData("/expdtls", params)
					.success(function (response) {
						$modalInstance.close(true);
					}).error(function (err) {
						$scope.formError = "form Invalid !!!";
						//$modalInstance.dismiss(false);
					});
			}
		} else {
			$scope.formError = "Form Invalid !!!";
			//$modalInstance.dismiss(false);
		}
	};

	$scope.deleteCall = function () {
		var params = {
			userid: $rootScope.userid,
			experienceid: isEdit.experienceid,
		};

		DataService.deleteData("/expdtls", params).success(function (response) {
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
