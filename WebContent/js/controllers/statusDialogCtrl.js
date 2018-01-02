erpApp.controller('StatusDialogueController',function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, status, $location, flag, action, dialogueTitle, erpWSService){
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.status = status;
	$scope.dialogueTitle = dialogueTitle;
	
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
			$rootScope.$emit("callPopulateStatusList",{});
			$scope.hide();
		}
	};
	
	$scope.saveStatusInformation = function(ev) {
		var data = {
				statusName : $scope.status.statusName,
				statusType : $scope.status.statusType,
		        description : $scope.status.description
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("status/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.status.id;
			erpWSService.updateItem("status/update", $scope.onItemUpdated, data);
		}
	};
	
	$scope.submitStatusInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveStatusInformation(event);
		} else {
			utils.showToast('Please fill all required information');
		}
	};
});