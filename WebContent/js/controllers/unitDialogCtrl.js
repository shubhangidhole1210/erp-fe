erpApp.controller('unitDialogCtrl',
		function($scope, $http, $mdDialog, $mdToast, unit, $rootScope, SERVER_URL, utils, Auth, $location, flag, action, dialogueTitle,erpWSService,saveButtonAction) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.unit = unit;
	$scope.dialogueTitle = dialogueTitle;
	console.log("$scope.unit:",$scope.unit);
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
			utils.showToast('Something went worng. Please try again later.')
		}else if(response.data.code === 2){
			console.log(response.data.message);
			$scope.unitNameWrrorMsg = response.data.message;
			$scope.unitInformation.name.$setValidity("unitNameError", false);
		}else{
			utils.showToast(response.data.message);
			$rootScope.$emit("CallPopulateUnitList",{});
			$scope.hide();
		}
	};
	
	$scope.onUnitNamechange = function(){
		$scope.unitInformation.name.$setValidity("unitNameError", true);
	}
	
	$scope.saveUnitInformation = function(ev) {
		var data = {
				name : $scope.unit.name,
				description : $scope.unit.description
		};
		if ($scope.flag == 0) {
			erpWSService.createItem("unit/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.unit.id;
			erpWSService.updateItem("unit/update", $scope.onItemUpdated, data);
		}
	};
	
	$scope.submitUnitInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveUnitInformation();
		} else {
			utils.showToast('Please fill all required information');
		}
	};
});