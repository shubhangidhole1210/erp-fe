erpApp.controller('rmTypeDialogueController',function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, rmType, $location, flag, action, dialogueTitle, erpWSService , saveButtonAction) {
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.rmType = rmType;
	$scope.dialogueTitle = dialogueTitle;
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
	
	$scope.onItemUpdated = function(response){
		$scope.onResponseReceived(response);
	};
	
	 $scope.onItemCreated = function(response){
		 $scope.onResponseReceived(response);
	 }
	
	$scope.onResponseReceived = function(response){
		if(response.data.code === 0){
			console.log(response.data.message);
			utils.showToast('Something went worng. Please try again later.')
		}else{
			utils.showToast(response.data.message);
			$rootScope.$emit("CallPopulateRmTypeList",{});
			$scope.hide();
		}
	};
	
	$scope.saveRMTypeInformation = function(ev) {
		var data = {
				rmTypeName : $scope.rmType.rmTypeName,
				description : $scope.rmType.description
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("rmtype/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.rmType.id;
			erpWSService.updateItem("rmtype/update", $scope.onItemUpdated, data);
		}
	};

	$scope.submitRMTypeInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveRMTypeInformation();
		} else {
			utils.showToast('Please fill all required information');
		}
	};
});