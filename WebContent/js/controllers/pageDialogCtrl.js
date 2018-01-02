erpApp.controller('pageDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,page,action,flag,dialogueTitle,erpWSService,saveButtonAction) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.page = page;
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
		}else{
			$scope.displayProgressBar = false;
			utils.showToast(response.data.message);
			$rootScope.$emit("CallPopulateUserTypeList",{});
			$scope.hide();
		}
	};
	
	$scope.savePageInformation = function(ev) {
		var data = {
				menu : $scope.page.menu,
				pageName : $scope.page.pageName,
				submenu : $scope.page.submenu,
				url : $scope.page.url,
				description : $scope.page.description
		};
		console.log("$scope.page.description:",$scope.page.description)
		if ($scope.flag == 0) {
			
			erpWSService.createItem("page/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.page.id;
			erpWSService.updateItem("page/update", $scope.onItemUpdated, data);
		}
	};

	$scope.submitPageInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.savePageInformation($event)
		} else {
			utils.showToast('Please fill all required information');
		}
	};
});