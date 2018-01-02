erpApp.controller('productInventoryDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,productInventory,flag,action,dialogueTitle,productAction,erpWSService,saveButtonAction){
	   
	    $scope.productInventory=productInventory;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.isProductreadOnly = productAction;
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
				utils.showToast(response.data.message)
			}else{
				utils.showToast(response.data.message);
				$rootScope.$emit("callPopulateProductInventoryList",{});
				  $scope.hide();
			}
		};
		
		$scope.saveProductInventory = function(ev) {
			var data = {
					 productId:$scope.productInventory.productId.id,
	    			 description:$scope.productInventory.description,
	    			 quantityAvailable:$scope.productInventory.quantityAvailable,
	    			 racknumber:$scope.productInventory.racknumber,
	    			 minimumQuantity:$scope.productInventory.minimumQuantity,
	    			 maximumQuantity:$scope.productInventory.maximumQuantity
			};
			if ($scope.flag == 0) {
				
				erpWSService.createItem("productinventory/create", $scope.onItemCreated, data);
			} else {
				 data.id=$scope.productInventory.id,
				erpWSService.updateItem("productinventory/update", $scope.onItemUpdated, data);
			}
		};
	    
		$scope.submitProductInventoryInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				 $scope.saveProductInventory($event);
			} else {
				utils.showToast('Please fill all required information');
			}
		};
	    
	   $scope.onProductListRecived = function(response){
			$scope.prducts = response.data.data;
	   };
	   
		$scope.getProductList=function(){
			erpWSService.getList("product/list", $scope.onProductListRecived);
		};

});