erpApp.controller('RMInvenaryDialogeController',
				function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, rmInventory, $location, flag, action, information, rmAction, erpWSService,saveButtonAction) {
	$scope.isReadOnly = action;
	$scope.isRmVisible = rmAction;
	$scope.flag = flag;
	$scope.rmInventory = rmInventory;
	$scope.information = information;
	$scope.isSaveButtonHide = saveButtonAction;
	
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
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
			utils.showToast(response.data.message)
		}else{
			utils.showToast(response.data.message);
			$rootScope.$emit("CallPopulateRMInventoryList",{});
			$scope.hide();
		}
	};
	
	$scope.saveRMInventoryInformation = function(ev) {
		var data = {
				rawmaterialId:$scope.rmInventory.rawmaterialId.id,
				quantityAvailable:$scope.rmInventory.quantityAvailable,
				name:$scope.rmInventory.name,
				description:$scope.rmInventory.description,
				minimumQuantity:$scope.rmInventory.minimumQuantity,
				maximumQuantity:$scope.rmInventory.maximumQuantity
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("rawmaterialinventory/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.rmInventory.id;
			erpWSService.updateItem("rawmaterialinventory/update", $scope.onItemUpdated, data);
		}
	};
	
	$scope.submitRMInventoryInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveRMInventoryInformation(event);
		} else {
			utils.showToast('Please fill all required information');
		}
	};
	
	$scope.onRmListRecived = function(response){
		$scope.rmList = response.data.data;
	};
	
	$scope.getRmList = function(){
		erpWSService.getList("rawmaterial/list", $scope.onRmListRecived);
	};

	
	
});