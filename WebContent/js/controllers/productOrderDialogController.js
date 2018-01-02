erpApp.controller('productOrderDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,productOrder,utils,flag,action,dialogueTitle,hideAction,clientAction,erpWSService,saveButtonAction) {
	  
	$scope.productOrder=productOrder;
    $scope.flag=flag;
    $scope.isReadOnly = action;
    $scope.dialogueTitle = dialogueTitle;
    $scope.isProductOrderAdd = hideAction;
    $scope.isClientReadOnly = clientAction;
    $rootScope.isAddButtonDisplay=true;
    $scope.orderproductassociations=[];
    $scope.orderProductAssociation={};
    $scope.productOrder.expectedDeliveryDate = new Date($scope.productOrder.expectedDeliveryDate);
    $scope.productOrder.createDate = new Date($scope.productOrder.createDate);
    $scope.isProducyOrderDisable =true;
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
			$rootScope.$emit("callPopulateProductOrderList",{});
			 $scope.hide();
		}
	};
	
	$scope.saveProductOrder = function(ev) {
		var data = {
		     productOrderAssociationDTOs : $scope.orderproductassociations,
   			 description:$scope.productOrder.description,
   			 poNO:$scope.productOrder.poNO,
   			 expectedDeliveryDate:$scope.productOrder.expectedDeliveryDate,
   			 createDate:$scope.productOrder.createDate,
   			 clientId:$scope.productOrder.clientId.id
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("productorder/createMultiple", $scope.onItemCreated, data);
		} else {
			data.id=$scope.productOrder.id;
			erpWSService.updateItem("productorder/update", $scope.onItemUpdated, data);
		}
	};
   
	$scope.submitProductOrderInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveProductOrder($event);
		} else {
			utils.showToast('Please fill all required information');
		}
		console.log(" $scope.orderproductassociations:", $scope.orderproductassociations);
	};
    
	$scope.onProductListRecived = function(response){
		$scope.products = response.data.data;
	};
	
	$scope.getProductList = function(){
		 erpWSService.getList("product/list", $scope.onProductListRecived);
	};
	
	    $scope.onClientListRecived = function(response){
	    	$scope.clients = response.data.data;
	    	console.log("$scope.clients:",$scope.clients);
	    };
	    
	    $scope.getClientList = function(){
	    	erpWSService.getList("client/list", $scope.onClientListRecived);
	    	 $scope.clearProductOrderList();
	    };
	    
	    $scope.addOrderProductAssociation = function(){
	    	console.log('Adding RM : ', $scope.orderProductAssociation);
	    	if( !angular.equals($scope.orderProductAssociation,{}) ){
	    		if(!$scope.isDuplicateRM($scope.orderProductAssociation)){
				   $scope.orderproductassociations.push($scope.orderProductAssociation);	
				   $scope.orderProductAssociation = {};
				   $scope.productOrderInformation.product.$setValidity("duplicateProductOrderMsg", true);
	    		}else{
					$scope.productOrderInformation.product.$setValidity("duplicateProductOrderMsg", false);
	    		}
			}
	    };
	    
	    $scope.onChangeProduct = function(){
	    	$scope.productOrderInformation.product.$setValidity("duplicateProductOrderMsg", true);
	    };
	    
	    $scope.isDuplicateRM = function(orderProductAssociation) {
			for (var i = 0; i < $scope.orderproductassociations.length; i++) {
				if ($scope.orderproductassociations[i].productId.id === orderProductAssociation.productId.id) {
					return true;
				}
			}
			return false;
		};
	    
	    $scope.deleteAddedProduct=function(index){
	    	console.log('delted products' +  $scope.orderproductassociations);
		    $scope.orderproductassociations.splice(index,1);
	    };
	    
	    $scope.getProductOrderId=function() {
	    	if($scope.productOrder.id){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productorder/productorderId/"+ $scope.productOrder.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(response) {
				$scope.productOrderList = response.data.data;
				console.log(response);
	             console.log('product order list' + $scope.productOrderList);
			}, function errorCallback(response) {
				console.log("Error");
			});
	   }
	    };
	    
	    $scope.clearProductOrderList = function(){
	    	console.log(" $scope.orderproductassociations")
	    	 $scope.orderproductassociations.length = 0;
	    };
	    
	  $scope.validateExpectedDeliveryDate = function(expectedDeliveryDate){
		  console.log("expected deliver date" + expectedDeliveryDate);
		  $scope.currentDate = new Date();
		  if(expectedDeliveryDate <= $scope.currentDate){
			  $scope.productOrderInformation.expecteddeliveryDate.$setValidity("expectedDeliveryDateMsg", false);
		  }else{
			     $scope.productOrderInformation.expecteddeliveryDate.$setValidity("expectedDeliveryDateMsg", true);
		  }
	  };
});