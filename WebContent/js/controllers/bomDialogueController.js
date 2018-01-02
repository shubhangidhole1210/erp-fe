/*erpApp
		.controller(
				'bomDialogueController',
				function($scope, $http, $location, $mdDialog, $mdToast,
						$rootScope, SERVER_URL, Auth, utils, bomInformation) {
					$scope.bomInformation = bomInformation;
					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};

					$scope.isDialogBoxvisible = true;
					$scope.cancel = function() {
						$scope.isDialogBoxvisible = false;
					};

					$scope.abc = function() {
						console.log($scope.rawMaterials);
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL + "productRMAsso/list";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.products = response.data;
									console.log(response);
									utils.hideProgressBar();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
						utils.showProgressBar();
					};

					$scope.getRawMaterials = function() {
						console.log($scope.rawMaterials);
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "productRMAsso/productRMAssoList/"
								+ $scope.product.product.id;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams)
								.then(
										function successCallback(response) {
											$scope.data = response.data;
											$scope.rawMaterialVendorList = response.data.data;
											console.log(response);
											utils.hideProgressBar();
										}, function errorCallback(response) {
											console.log("Error");
											utils.hideProgressBar();
										});
						utils.showProgressBar();
					};

					$scope.getVenodrList = function() {
						console.log($scope.rawMaterials);
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "rmvendorasso/rmVendorList/1";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.vendorList = response.data;
									console.log("$scope.vendorList",
											$scope.vendorList)
									console.log(response);
									utils.hideProgressBar();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
						utils.showProgressBar();
					};

					$scope.submitBomInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveBomData();
						} else {
							console.log('its else block');
							utils
									.showToast('Please fill all required information');
						}
					};

					$scope.caluculatePrice = function(quantity, index) {
						console.log(quantity);
						console.log('$scope.vendorList', $scope.vendorList)
						for (var i = 0; i < $scope.vendorList.length; i++) {
							$scope.data.data[index].pricePerUnit = $scope.vendorList[i].pricePerUnit
									* quantity;
							console.log('$scope.pricePerUnitL :',
									$scope.pricePerUnit);
						}
					};

					$scope.duplicateRM = function(rawMaterialVendorList) {
						console.log("in duplicate RM function");
						console.log("$scope.rawMaterialVendorList",
								$scope.rawMaterialVendorList);
						for (var i = 0; i < $scope.rawMaterialVendorList.length; i++) {
							if ($scope.rawMaterialVendorList[i].rawmaterial === rawMaterialVendorList.rawmaterial) {
								return true;
							}
						}
						return false;
					};

					$scope.saveBomData = function() {
						console.log("in save function")
						console.log($scope.data.data);
						var index = 0;
						var rmVendorList = [];
						for (index = 0; index < $scope.data.data.length; index++) {
							var rmVendor = {};
							rmVendor.rawmaterial = $scope.data.data[index].rawmaterial.id;
							rmVendor.pricePerUnit = $scope.data.data[index].pricePerUnit;
							rmVendor.quantity = $scope.data.data[index].quantity;
							rmVendor.vendor = $scope.data.data[index].vendor.id;
							rmVendorList.push(rmVendor)
							var data = {
								product : $scope.product.product.id,
								bomId : $scope.bomId,
								bomModelParts : rmVendorList
							};
							var httpparams = {
								method : 'post',
								url : SERVER_URL + "bom/createmultiple",
								data : data
							};
							httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
							$http(httpparams)
									.then(
											function successCallback(data) {
												console.log(data);
												if (data.data.code === 1) {
													utils
															.showToast(data.data.message);
												} else {
													utils
															.showToast(data.data.message);
												}
												utils.hideProgressBar();
											},
											function errorCallback(response) {
												console.log("Error");
												utils
														.showToast("Something went wrong. Please try again later.");
												utils.hideProgressBar();
											});
							utils.showProgressBar();
						}
					}
				});*/