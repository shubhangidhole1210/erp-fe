erpApp.controller('clientDialogCtrl',function($scope, $mdDialog, client,
		$location, $rootScope,SERVER_URL,flag,action,dialogueTitle,Auth,$http,utils,erpWSService,saveButtonAction){
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.client = client;
	$scope.dialogueTitle = dialogueTitle;
	$scope.isSaveButtonHide = saveButtonAction;
	
	
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
			utils.showToast('Something went worng. Please try again later.')
		}else if(response.data.code  === 2){
			console.log(response.data.message);
			utils.showToast(response.data.message)
			if(response.data.message === "CompanyName already exists !"){
				console.log("CompanyName already exists !");
				utils.showToast(response.data.message);
				$scope.companyNameApiErrorMsg = "CompanyName already exists !";
				$scope.clientInformation.companyname.$setValidity("companyNameApiError", false);
			}else if(response.data.message === "Email already exists !"){
				console.log("Email already exists !");
				utils.showToast(response.data.message);
				$scope.emailIdErrorMsg = "Email already exists !";
				$scope.clientInformation.emailid.$setValidity("emailIdError", false);
			}else{}
		}else{
			utils.showToast(response.data.message);
			$rootScope.$emit("CallPopulateClientList",{});
			$scope.hide();
		}
	};
	
	$scope.onChangeEmailId = function(){
		$scope.clientInformation.emailid.$setValidity("emailIdError", true);
	};
	
	$scope.onChangeCompanyName = function(){
		$scope.clientInformation.companyname.$setValidity("companyNameApiError", true);
	};
	
	$scope.saveClient = function(ev) {
		var data = {
				companyName: $scope.client.companyName,
				description: $scope.client.description,
				address: $scope.client.address,
				emailId: $scope.client.emailId,
				contactNumber:$scope.client.contactNumber ,
				contactPersonName: $scope.client.contactPersonName,
				commisionerate: $scope.client.commisionerate,
	    		 cst: $scope.client.cst,
	    		 customerEccNumber: $scope.client.customerEccNumber,
	    		 division: $scope.client.division,
	    		 vatNo: $scope.client.vatNo,
	    		 renge: $scope.client.renge
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("client/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.client.id;
			erpWSService.updateItem("client/update", $scope.onItemUpdated, data);
		}
	};
	
	$scope.submitClientInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveClient(event);
		} else {
			console.log('its else block');
			 utils.scrollToTop();
			utils.showToast('Please fill all required information');
		}
	};
});