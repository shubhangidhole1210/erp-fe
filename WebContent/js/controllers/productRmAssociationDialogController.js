erpApp.controller('productRmAssociationDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,flag,action,information,productRmAsso,productAction,$q, $log,erpWSService,saveButtonAction) {
	  $scope.productRmAsso = productRmAsso;
	  console.log("Product RM Association : ", productRmAsso);
	  if(angular.equals($scope.productRmAsso,{})){
		  $scope.productRmAsso.productRMAssociationModelParts = [];
	  }
	  
	  $scope.rawmaterialPart = {};
	  $scope.flag = flag;
	  $scope.isReadOnly = action;
	  $scope.productIdReadOnly = productAction;
	  $scope.information = information;
	  $scope.isRMTypeSelected = true;
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
				$rootScope.$emit("callPopulateProductRmAssociationList",{});
				$scope.hide();
			}
		}
		
		$scope.saveProductRMAssociationInformation = function(ev) {
			var data = {
					product : $scope.productRmAsso.product,
		    		productRMAssociationModelParts: $scope.productRmAsso.productRMAssociationModelParts
			};
			if ($scope.flag == 0) {
				
				erpWSService.createItem("productRMAsso/createmultiple", $scope.onItemCreated, data);
			} else {
				data.id=$scope.productRmAsso.id,
				erpWSService.updateItem("productRMAsso/update/multipleProductRMAssociation", $scope.onItemUpdated, data);
			}
		};
	    
	
    	$scope.submitProductRMAssociationInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveProductRMAssociationInformation();
			} else {
				utils.showToast('Please fill all required information');
			}
		};
	    
	   
	    $scope.deleteRawMaterial = function(index){
	    	console.log('in delete RM'+ $scope.productRmAsso.productRMAssociationModelParts);
		    $scope.productRmAsso.productRMAssociationModelParts.splice(index,1);
	    };
		
		
	    $scope.getRawMtaerialByRmType = function(index){
	    	console.log("Getting RM List");
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rawmaterial/getRMaterialList/" + $scope.RMTypeId.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(function successCallback(response) {
				$scope.rawMtaerials = response.data.data;
				console.log("RM List : ", $scope.rawMtaerials);
				  $scope.isRMTypeSelected = false;
			}, function errorCallback(response) {
				console.log("Error");
			});
			 //$scope.clearAddedRMList();
	    };
		  
	    $scope.addRawMaterial = function(){
	    	console.log('Adding RM : ', $scope.rawmaterialPart);
	    	if( !angular.equals($scope.rawmaterialPart,{}) ){
	    		if(!$scope.isDuplicateRM($scope.rawmaterialPart)){
				   $scope.productRmAsso.productRMAssociationModelParts.push($scope.rawmaterialPart);	
				   $scope.rawmaterialPart = {};
				 
	    		}else{
					
	    		}
			}
	    };
	    
	    function getProductListURL(){
	    	return ($scope.flag === 0) ? "product/list/newProductRMAssociation" : "product/list";
	    };
	    
	    $scope.getProducts = function() {
	    	console.log("Getting Products");
	    	$scope.flag === 0 ? $scope.getProductsWithoutRMAssociation() : $scope.getAllProducts();
		};
	    
	   /* $scope.getProductsWithoutRMAssociation = function() {
	    	
	    	var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "product/list/newProductRMAssociation";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
			 $http(httpparams).then(function successCallback(response) {
					$scope.products = response.data.data;
					$scope.productList = response.data.data.map(function(product){ return product.partNumber});
					 				
				}, function errorCallback(response) {
					console.log("Error");
				});
		};*/
		
		$scope.onProductRMAssociationListRecived = function(response){
			$scope.products = response.data.data;
			$scope.productList = response.data.data.map(function(product){ return product.partNumber});
		};
		
		 $scope.getProductsWithoutRMAssociation = function() {
			 erpWSService.getList("product/list/newProductRMAssociation" , $scope.onProductRMAssociationListRecived);
		 };
		
		
		$scope.OnProductListRecived = function(response){
			$scope.products = response.data.data;
		};
		
		
		
		$scope.getAllProducts = function(){
			erpWSService.getList("product/list",$scope.OnProductListRecived);
		};
		
		$scope.validateAddedQuantity = function(quantity) {
			if (quantity <= 0) {
				$scope.addQuantityMsg = 'quantity should be greater than 0';
				$scope.productRMAssociationInformation.quantity.$setValidity("addQuantityMsg", false);
			} else {
				$scope.productRMAssociationInformation.quantity.$setValidity("addQuantityMsg", true);
			}
		};
		
		$scope.isDuplicateRM = function(orderRawMaterial){
			for (var i = 0; i < $scope.productRmAsso.productRMAssociationModelParts.length; i++) {
				if ($scope.productRmAsso.productRMAssociationModelParts[i].rawmaterial.id === orderRawMaterial.rawmaterial.id) {
					return true;
				}
			}
			return false;
		};
		
		$scope.onRMTypeListRecived = function(response){
			$scope.rmTypeList = response.data.data;
		};
		
		$scope.getRmTypeList= function(){
			erpWSService.getList("rmtype/list",$scope.onRMTypeListRecived);
		};
		
		
	  $scope.clearAddedRMList = function(){
		  console.log("in clearRmList function");
		  console.log("$scope. productRmAsso.productRMAssociationModelParts " ,$scope. productRmAsso.productRMAssociationModelParts);
		  $scope. productRmAsso.productRMAssociationModelParts.length = 0;
	  }
		
});
