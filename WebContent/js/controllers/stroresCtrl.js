	erpApp.controller('stroresCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL, utils, Auth, $location,erpWSService) {
					$scope.ischeckBoxDisabled = true;
					$scope.isRawMaterial = false;
					document.getElementById('invoiceNumber').focus();
					
					$scope.onRMOrderListRecived = function(response){
						$scope.invoiceList = response.data.data;
						$scope.IsRmInvoicePresent(); 
					};
					
					$scope.getRMOrderInvoiceInformation = function(){
						 erpWSService.getList("rawmaterialorderinvoice/quality-check-invoices", $scope.onRMOrderListRecived);
					};

					$scope.IsRmInvoicePresent = function(){
						$scope.isRawMaterial = $scope.invoiceList.length ===null? true:false;
					};
					
					$scope.OnRawMaterialListRecived = function(response){
						$scope.rmInvoiceList = response.data.data;
					};
					
					$scope.qualityCheckRMList = function(index){
						 erpWSService.getList("qualitycheckrawmaterial/listrmGoodQuantity/" + $scope.invoiceList.id, $scope.OnRawMaterialListRecived);
					};
					
					$scope.onItemCreated = function(response){
						$scope.onResponseReceived(response); 
					};
					
					$scope.onResponseReceived = function(response){
						if(response.data.code === 1){
							$location.path('/');
							utils.showToast(response.data.message);
						}else{
							utils.showToast(response.data.message);
						}
					};
					
					$scope.savermStoreInformation = function(ev) {
						var index = 0;
						for (index = 0; index < $scope.rmInvoiceList.length; index++) {
							$scope.rmInvoiceList[index].intakeQuantity = $scope.rmInvoiceList[index].quantity;
						}
						var data = {
								description : $scope.description,
								id : $scope.invoiceList.id,
								qualitycheckrawmaterials : $scope.rmInvoiceList
						};
							erpWSService.createItem("qualitycheckrawmaterial/qualityCheckInReadyStore", $scope.onItemCreated, data);
					};

					$scope.submitRmInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.savermStoreInformation();
						} else {
							utils.showToast('Please fill all required information');
						}
					};

					$scope.resetQualityInspection = function() {
						$location.path('/');
					};
				});

	
	