erpApp.controller('todaysProductionPlanCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL, Auth, utils, $location,erpWSService,erpWSService) {
					
					$scope.isTodaysProductionPlanPresent=false;
					$scope.isButton = false;
					$scope.currentDate = utils.getCurrentDate();
					
					$scope.onTodaysProductionList = function(response){
						$scope.productList = response.data.data;
						if(response.data.code === 101){
							$scope.message = response.data.message;
						}
						$scope.isProductionPlanInformation();
					};
					
					$scope.getTodaysProductionPlan = function(){
						erpWSService.getList("productionplanning/getProductionPlanReadyListByDate/" + $scope.currentDate,$scope.onTodaysProductionList);
					};

					$scope.submitTodaysProductionplanInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveTodaysProductionPlan();
						} else {
							utils.showToast('Please fill all required information.');
						}
					};
					
					$scope.isProductionPlanInformation = function(){
						$scope.isTodaysProductionPlanPresent = $scope.productList.length === 0 ? true : false;
						$scope.isButton = $scope.productList.length === 0 ? false : true;
					};
					
					
					$scope.onItemCreated = function(response){
						$scope.onResponseReceived(response); 
					};
					
					$scope.onResponseReceived = function(response){
						if(response.data.code === 1){
							$location.path('/');
							utils.showToast('Raw Material quality check Successfully !');
							utils.hideProgressBar();
						}else{
							utils.showToast(response.data.message);
							utils.hideProgressBar();
						}
						$scope.resetQualityInspectionForm();
					};
					
			
					$scope.saveTodaysProductionPlan = function() {
						var index = 0;
						var productinPlanDTOs = [];
						for (index = 0; index < $scope.productList.length; index++) {
							if(($scope.productList[index].achived && $scope.productList[index].achived !== 0) || ($scope.productList[index].repairedQuantity && $scope.productList[index].repairedQuantity !== 0)){
								var product = {};
								product.productId = $scope.productList[index].productId.id;
								product.targetQuantity = $scope.productList[index].targetQuantity;
								product.completedQuantity = $scope.productList[index].completedQuantity;
								product.achivedQuantity = $scope.productList[index].achived;
								product.remark = $scope.productList[index].remark;
								product.repairedQuantity = $scope.productList[index].repairedQuantity;
								product.qualityPendingQuantity = $scope.productList[index].qualityPendingQuantity;
								product.productionPlanId = $scope.productList[index].id;
								productinPlanDTOs.push(product);
							}
						}
						var data = {
								createDate : $scope.currentDate,
								dailyProductionPlanDTOs : productinPlanDTOs
						};
						var httpparams = {
							method : 'post',
							url : SERVER_URL
									+ "dailyproduction/dailyproductionSave",
							data : data
						};
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						if(productinPlanDTOs.length !== 0){
							$http(httpparams)
									.then(
											function successCallback(data) {
												console.log(data.data.message);
												console.log(data);
												if (data.data.code === 1) {
													utils.showToast("Today's Production Plan Updated Sucessfully!");
													$location.path('/');
												} else {
													utils.showToast("Something went wrong. Please try again later.");
												}
												utils.hideProgressBar();
											},
											function errorCallback(response) {
												utils.showToast("Something went wrong. Please try again later.");
												utils.hideProgressBar();
											});
								utils.showProgressBar();
						}else{
							utils.showToast("Please enter valid data.");
						}
					};
					
					$scope.validateTargetQuantity = function(storeOutQuantity,completedQuantity,failedQuantity,qualityPendingQuantity,achived,qualityCheckedQuantity,$index){
						$scope.totalOfDailyProductionPlanQuantity = completedQuantity + failedQuantity + qualityPendingQuantity + achived + qualityCheckedQuantity;
						if(storeOutQuantity >= $scope.totalOfDailyProductionPlanQuantity){
							$scope.todaysProductionPlanForm["achivedQuantity" + $index].$setValidity("customError", true);
						}else{
							$scope.todaysProductionPlanForm["achivedQuantity" + $index].$setValidity("customError", false);
						}
					};
					
					$scope.cancelTodaysProductionPlan = function(){
						$location.path('/');
					}
				
				});