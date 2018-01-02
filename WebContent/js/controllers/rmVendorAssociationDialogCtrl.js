
erpApp.controller(
				'RMVendorAssociationDialogCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,rmVendorAssociation,flag,action,dialogueTitle,dropdownAction,erpWSService,saveButtonAction ){
					$scope.isReadOnly = action;
					$scope.flag = flag;
					$scope.rmVendorAssociation = rmVendorAssociation;
					$scope.dialogueTitle = dialogueTitle;
					$scope.isDropDownreadOnly = dropdownAction;
					$scope.taxStructureDTO ={};
					$scope.isSaveButtonHide = saveButtonAction;
					if(flag !== 0){
						$scope.RMTypeId = {};
						$scope.RMTypeId.id = rmVendorAssociation.rawmaterialId.rmTypeId.id;
//						$scope.getRawMaterialByRmType();
					}
 
					
					$scope.hide = function() {
						console.log('hide DialogController');
						$mdDialog.hide();
					};
					

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};
					
					$scope.onRMTypeListRecived = function(response){
						$scope.rmTypeList = response.data.data;
					};
					
					$scope.getRmTypeList= function(){
						erpWSService.getList("rmtype/list",$scope.onRMTypeListRecived);
					};
					
					$scope.getRawMaterialByRmType = function(index){
				    	console.log("Getting RM List for type : ", $scope.RMTypeId.id);
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL + "rawmaterial/getRMaterialList/" + $scope.RMTypeId.id;
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(function successCallback(response) {
							$scope.rawmaterials = response.data.data;
							console.log("RM List : ", $scope.rawmaterials);
							  $scope.isRMTypeSelected = false;
						}, function errorCallback(response) {
							console.log("Error");
						});
						 //$scope.clearAddedRMList();
				    };
					
					
					$scope.onItemCreated = function(response){
						$scope.onResponseReceived(response); 
					};
					
					$scope.onItemUpdated = function(response){
						$scope.onResponseReceived(response);
					};
					
					$scope.onResponseReceived = function(response){
						if(response.data.code === 0){
							console.log(response.data.message);
							console.log(data);
							utils.showToast('Something went worng. Please try again later.');
						}else if(response.data.code === 2){
							utils.showToast(response.data.message);
						}else{
							console.log(response.data.message);
							utils.showToast('Raw Material Vendor Association Information saved successfully.');
							$rootScope.$emit("CallPopulateRMVendorAssociationList",{});
							$scope.hide();
						}
					};

					$scope.savermVendorAssociation = function(ev) {
						$scope.taxStructureDTO.cgst = $scope.rmVendorAssociation.taxStructureDTO.cgst;
						$scope.taxStructureDTO.igst = $scope.rmVendorAssociation.taxStructureDTO.igst;
						$scope.taxStructureDTO.other1 = $scope.rmVendorAssociation.taxStructureDTO.other1;
						$scope.taxStructureDTO.other2 = $scope.rmVendorAssociation.taxStructureDTO.other2;
						$scope.taxStructureDTO.sgst = $scope.rmVendorAssociation.taxStructureDTO.sgst;
						var data = {
								rawmaterialId:$scope.rmVendorAssociation.rawmaterialId.id,
								vendorId:$scope.rmVendorAssociation.vendorId.id,
								pricePerUnit:$scope.rawmaterial.pricePerUnit,
								taxStructureDTO: $scope.taxStructureDTO
						};
						if ($scope.flag == 0) {
							
							erpWSService.createItem("rmvendorasso/create", $scope.onItemCreated, data);
						} else {
							data.id = $scope.rmVendorAssociation.id;
							console.log("data.id:",data.id);
							erpWSService.updateItem("rmvendorasso/update", $scope.onItemUpdated, data);
						}
					};
					
	

					$scope.submitRMVendorAssociationInformation = function(isvaliduser,$event) {
						if (isvaliduser) {
							$scope.savermVendorAssociation();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};
					
					
					$scope.onRawMaterialListRecived = function(response){
				    	$scope.rawmaterials = response.data.data;
				    };
				    
				    $scope.getRawMaterials=function(){
				    	 erpWSService.getList("rawmaterial/list", $scope.onRawMaterialListRecived)
				    }
					    
					    
					    $scope.getPrice=function(){
					    	var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "rawmaterial/" +$scope.rmVendorAssociation.rawmaterialId.id;
							//console.log("$scope.rmVendorAssociation.rawmaterialId.id :" ,$scope.selectedRM.id);
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.rawmaterial = response.data.data;
								console.log("In get raw materials function $scope.rawmaterials is(price function) :",$scope.rawmaterial);
							}, function errorCallback(response) {
								console.log("Error");
							});
					    };
					    
				
					    $scope.onVendorListRecived = function(response){
					    	$scope.venodrs = response.data.data;
					    };
					    
					    $scope.getVendors=function(){
					    	 erpWSService.getList("vendor/list", $scope.onVendorListRecived);
					    };
					   
					
});
