erpApp.controller('userTypeDialogCtrl',function($scope, $mdDialog, $mdToast, $rootScope, utils, userType, flag, action, information, erpWSService, saveButtonAction){
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.userType = userType;
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
			utils.showToast('Something went worng. Please try again later.')
		}else if(response.data.code === 2){
			console.log(response.data.message);
			utils.showToast(response.data.message);
			$scope.userTypeNameApiErrorMsg = response.data.message;
			$scope.userTypeInformation.usertypeName.$setValidity("userTypeNameError", false);
		}else{
			$scope.displayProgressBar = false;
			utils.showToast(response.data.message);
			$rootScope.$emit("CallPopulateUserTypeList",{});
			$scope.hide();
		}
	};
	
	$scope.onchangeusertypename = function(){
		$scope.userTypeInformation.usertypeName.$setValidity("userTypeNameError", true);
	}
	
	$scope.saveUserTypeInformation = function(ev) {
		var data = {
				usertypeName : $scope.userType.usertypeName,
				description : $scope.userType.description
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("usertype/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.userType.id;
			erpWSService.updateItem("usertype/update", $scope.onItemUpdated, data);
		}
	};
	
	$scope.submitUserTypeInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveUserTypeInformation($event);
		} else {
			utils.showToast("Please fill all required information");
		}
	};
	
	
});