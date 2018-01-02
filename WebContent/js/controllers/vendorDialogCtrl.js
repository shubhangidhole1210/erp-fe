erpApp.controller('DialogVendorController', function($scope,$http, $mdDialog,vendor,flag,action,$rootScope,$mdToast,dialogueTitle,Auth,utils,SERVER_URL,erpWSService,saveButtonAction) {
	  $scope.vendor=vendor;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.dialogueTitle = dialogueTitle;
	    $scope.isSaveButtonHide = saveButtonAction;
	    
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

	    $scope.onItemCreated = function(response){
			$scope.onResponseReceived(response); 
		};
		
		$scope.onItemUpdated = function(response){
			$scope.onResponseReceived(response);
		};
		
		$scope.onResponseReceived = function(response){
			if(response.data.code === 0){
				console.log(data);
				utils.showToast("Something went worng. Please try again later.");
			}else if(response.data.code === 2){
			/*	utils.showToast(response.data.message);
				console.log(response.data.message);*/
			    if(response.data.message === "CompanyName already exists !"){
			    	utils.showToast(response.data.message);
			    	$scope.companyNameApiErrorMsg = response.data.message;
			    	$scope.vendorInformation.companyName.$setValidity("companyNameApiError", false);
			    }else if(response.data.message === "Email already exists !"){
			    	utils.showToast(response.data.message);
			    	emailIdApiErrorMsg = response.data.message;
			    	$scope.vendorInformation.email.$setValidity("emailIdApiError", false);
			    }else{}
			}else{
				$scope.hide();
			   utils.showToast(response.data.message);
			   $rootScope.$emit("callPopulateVendorList",{});
			}
		};
		
		$scope.onChangeCompanyName = function(){
			$scope.vendorInformation.companyName.$setValidity("companyNameApiError", true);
		};
		
		$scope.onEmailIdChange = function(){
			$scope.vendorInformation.email.$setValidity("emailIdApiError", true);
		};
		
		$scope.saveVendorInformation = function(ev) {
			var data = {
					 companyName : $scope.vendor.companyName,
		    		 email: $scope.vendor.email,
		    		 firstName : $scope.vendor.firstName ,
		    		 lastName : $scope.vendor.lastName,
		    		 address : $scope.vendor.address, 
		    		 contactNumberMobile : $scope.vendor.contactNumberMobile,
		    		 contactNumberOffice: $scope.vendor.contactNumberOffice,
		    		 city : $scope.vendor.city,
		    		 state : $scope.vendor.state,
		    		 postalcode : $scope.vendor.postalcode,
		    		 description: $scope.vendor.description,
		    		 commisionerate: $scope.vendor.commisionerate,
		    		 cst: $scope.vendor.cst,
		    		 customerEccNumber: $scope.vendor.customerEccNumber,
		    		 divison: $scope.vendor.divison,
		    		 vatNo: $scope.vendor.vatNo,
		    		 renge: $scope.vendor.renge
			};
			if ($scope.flag == 0) {
				
				erpWSService.createItem("vendor/create", $scope.onItemCreated, data);
			} else {
				  data.id=$scope.vendor.id,
				erpWSService.updateItem("vendor/update", $scope.onItemUpdated, data);
			}
		};
		
    		$scope.submitVendorInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveVendorInformation();
			} else {
				utils.showToast('Please fill all required information');
			}
		};
});