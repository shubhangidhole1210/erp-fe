erpApp.controller('packingPageDialogController', function($scope,$http, $mdDialog,barcode,flag,action,$rootScope,$mdToast,dialogueTitle,Auth,utils,SERVER_URL,erpWSService,saveButtonAction) {
	  $scope.barcode=barcode;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.dialogueTitle = dialogueTitle;
	    $scope.isSaveButtonHide = saveButtonAction;
	    $scope.barcode.isBag = false;
		$scope.barcode.isBox = false;
		$scope.barcode.isUnit = false;
	    
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
			}else{
				$scope.hide();
			   utils.showToast(response.data.message);
			   $rootScope.$emit("callPopulateBarcodedList",{});
			}
		};
		
		$scope.onSendOptionChanged = function(){
			console.log("sendOption :" , $scope.sendOption);
			if($scope.sendOption === "isBag"){
				$scope.barcode.isBag = true;
				$scope.barcode.isBox = false;
				$scope.barcode.isUnit = false;
			}else if($scope.sendOption === "isBox"){
				$scope.barcode.isBag = false;
				$scope.barcode.isBox = true;
				$scope.barcode.isUnit = false;
			}else{
				$scope.barcode.isBag = false;
				$scope.barcode.isBox = false;
				$scope.barcode.isUnit = true;
			}
		};
		
		$scope.saveBarcodedInformation = function(ev) {
			var data = {
					productId : $scope.barcode.product.id,
					description :$scope.barcode.description,
					quantity : $scope.barcode.quantity,
					isBag : $scope.barcode.isBag,
					isBox : $scope.barcode.isBox,
					isUnit :  $scope.barcode.isUnit
			};
			if ($scope.flag == 0) {
				
				erpWSService.createItem("barcodeTracker/create", $scope.onItemCreated, data);
			} else {
				  data.id=$scope.vendor.id,
				erpWSService.updateItem("barcodeTracker/update", $scope.onItemUpdated, data);
			}
		};
		
    		$scope.submitPackaginInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveBarcodedInformation();
			} else {
				utils.showToast('Please fill all required information');
			}
		};
		

		$scope.getProductList = function() {
		     erpWSService.getList("productorderassociation/productOrderList", $scope.onListReceived);
		};
		
		$scope.onListReceived = function(response){
			$scope.productList = response.data.data;
			console.log("$scope.productList:",$scope.productList);
		};
});