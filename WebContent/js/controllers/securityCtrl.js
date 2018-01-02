erpApp.controller('securityCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL, $filter, utils, Auth, $location,erpWSService) {
					var date = new Date();
					$scope.createDate = $filter('date')(Date.now(),'MM-dd-yyyy');
					$scope.rmMsg = true;
					$scope.isClientselct=true;
					$scope.rmOrderCreationMsg  = false;
					$scope.isSaveButtonDisabled = false;
					$scope.createDate = new Date($scope.createDate);

					// TODO Setting Default for Testing Later It should be
					$scope.driver_Name = "Sanjay";
					$scope.vehicleNo = "MH 12 AB 1212";
					$scope.intime = new Date();
					$scope.outtime = new Date();
					/*$scope.outtime.setTime($scope.intime.getTime()
							+ (15 * 60 * 1000));
*/
					$scope.onRMOrderListRecived = function(response){
						$scope.rawMaterials = response.data.data;
					};
					
					$scope.getRMInformation = function() {
						 erpWSService.getList("rawmaterialorder/list/securityCheck", $scope.onRMOrderListRecived);
					};
					
					$scope.RMForVendorRmOrderListRecived = function(response){
						$scope.rawMaterialList = response.data.data;
						if (response.data.code == 0) {
							utils.showToast(response.data.message);
						}else{}
					};
					
					$scope.clearRMList = function(){
						$scope.rawMaterialList.length = 0;
					};
					
					$scope.getRMListForRMOrder = function(index) {
						 erpWSService.getList("rawmaterialorderassociation/getRMForRMOrder/" + $scope.selectedRMOrderId, $scope.RMForVendorRmOrderListRecived);
						
					};

					$scope.onRMVendorListRecived = function(){
						$scope.statusInformationList = response.data.data;
					};
					
					$scope.displayStatusInformationList = function(index) {
						 erpWSService.getList("rawmaterialorderinvoice/liststatus/" + $scope.rawmaterialorderinvoice.id, $scope.onRMVendorListRecived);
					};
					
					$scope.onItemCreated = function(response){
						$scope.onResponseReceived(response); 
					};
					
					$scope.onResponseReceived = function(response){
						if(response.data.code === 0){
							console.log(response.data.message);
							utils.showToast(response.data.message)
						}else{
							utils.showToast(response.data.message);
							$location.path('/');
						}
					};

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveSecurityInformation();
						} else {
							utils.showToast('Please fill all required information');
						}
					};

					$scope.saveSecurityInformation = function(ev) {
						var index = 0;
						var rmorderinvoiceintakquantities = [];
						for (index = 0; index < $scope.rawMaterialList.length; index++) {
							var rmorderinvoiceintakquantity = {};
							rmorderinvoiceintakquantity.rawMaterailId = $scope.rawMaterialList[index].id;
							rmorderinvoiceintakquantity.quantity = $scope.rawMaterialList[index].invoiceQuantity;
							rmorderinvoiceintakquantity.remainingQuantity = $scope.rawMaterialList[index].remainingQuantity;
							rmorderinvoiceintakquantity.isReturnInvoiceInitated = true;
							rmorderinvoiceintakquantities
									.push(rmorderinvoiceintakquantity);
						}
					
						var data = {
								invoiceNo : $scope.invoice_No,
								vendorName : $scope.selectedVendor,
								vehicleNo : $scope.vehicleNo,
								driverFirstName : $scope.firstName,
								driverLastName : $scope.lastName,
								 licenceNo : $scope.licenceNo,
								 description : $scope.description,
								createDate : $scope.createDate,
								inTime : $scope.intime.toLocaleTimeString().split(" ")[0],
								outTime : $scope.outtime.toLocaleTimeString().split(" ")[0],
								poNo : $scope.selectedRMOrderId,
								qualityCheckRMDTOs : rmorderinvoiceintakquantities
						};
							erpWSService.createItem("rawmaterialorderinvoice/securitycheck", $scope.onItemCreated, data);
					};

					$scope.toCompareQuantity = function(remainingQuantity,invoiceQuantity,$index) {
						$scope.errorMsg = "";
						if (remainingQuantity === invoiceQuantity) {
							console.log("its if block");
							$scope.securityInformation["invoiceQuantity" + $index].$setValidity("invoiceQuantityMsg", true);
						} else {
							console.log("else block");
							$scope.securityInformation["invoiceQuantity" + $index].$setValidity("invoiceQuantityMsg", false);
						}
					};

					$scope.onVendorListReceived = function(response){
						$scope.vendorData = response.data.data;
					};
					
					$scope.getVendorList = function(){
						 erpWSService.getList("vendor/list", $scope.onVendorListReceived);
					};
					
					$scope.onRMOrderForVendorListRecived = function(response){
						$scope.vendorRmList = response.data.data;
						console.log("response:",response);
						console.log("$scope.vendorRmList:",$scope.vendorRmList);
						$scope.displayRmOrderCreation();
					};
					
					/*$scope.onChangeVendorIsRMOrderPresent = function(){
						
					}*/
					
					$scope.getRMOrdersForVendor = function(index){
						$scope.rmMsg = false;
						$scope.isClientselct=false;
						erpWSService.getList("rawmaterialorder/getVendorOrder/" + $scope.selectedVendor, $scope.onRMOrderForVendorListRecived);
						$scope.clearRMList();
					};
					
					$scope.onResponseReceived = function(response){
						if(response.data.code === 1){
							utils.showToast("Raw Material security check sucessfully !");
					        $location.path('/');
						}else{
							utils.showToast(data.data.message);
						}
					};
					
					$scope.displayRmOrderCreation = function(){
						if($scope.vendorRmList === null){
							$scope.rmOrderCreationMsg  = true;
							$scope.isClientselct=true;
							$scope.isSaveButtonDisabled = true;
						}else{
							$scope.rmOrderCreationMsg  = false;
							$scope.isClientselct=false;
							$scope.isSaveButtonDisabled = false;
						}
					};
					
					$scope.restInformation = function() {
						$location.path('/');
					};
				});
