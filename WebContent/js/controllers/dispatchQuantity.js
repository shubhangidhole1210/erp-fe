erpApp.controller('dispatchQuantityCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location,erpWSService) {
	
	$scope.isproduct = false;
	
	$scope.onProductOrderListRecived = function(response){
		$scope.productOrders = response.data.data;
	};
	
	$scope.populateProductOrderPendingList = function() {
		 erpWSService.getList("productorder/pendingList", $scope.onProductOrderListRecived);
	};
	
	$scope.isProductPresent = function(){
        $scope.isproduct = $scope.productOrders.length ===0? true :false;
	};
	
	$scope.onProductListRecived = function(response){
		//$scope.data = response.data.data;
		$scope.orderProductList = response.data.data;
		console.log("$scope.orderProductList:",$scope.orderProductList);
		//console.log("response :",response);
	};
	
	$scope.getDispatchquantity=function($index){
		 erpWSService.getList("productorder/productorderId/" + $scope.order.id, $scope.onProductListRecived);
	};
	
	$scope.onItemCreated = function(response){
		$scope.onResponseReceived(response); 
	};
	
	$scope.onResponseReceived = function(response){
		console.log(response);
		if(response.data.code === 1){
			console.log(response.data.message);
			console.log("in if block")
			utils.showToast(response.data.message);
			$location.path('/');
		}else{
			utils.showToast(response.data.message);
			console.log("in else block");
		}
	};
	
	
	$scope.saveDispatchQuantity = function(ev) {
		var index=0;
		var productsList = [];
		for(index=0;index<$scope.orderProductList.length;index++){
			var dispatchProduct = {};
			dispatchProduct.productId= $scope.orderProductList[index].productId;
			dispatchProduct.quantity = $scope.orderProductList[index].remainingQuantity;
			productsList.push(dispatchProduct);
		}
		var data = {
				orderId: $scope.order.id,
				invoiceNo: $scope.invoice,
				description:$scope.description,
				dispatchPartDTOs:productsList
		};
			erpWSService.createItem("dispatch/dispatchProducts", $scope.onItemCreated, data);
	};
	
	$scope.submitInformation = function(isvaliduser,$event) {
		if(isvaliduser){
			$scope.saveDispatchQuantity();
		}else{
			utils.showToast("Please fill all required information");
		}
     };
	
	$scope.cancelDispatchQuantityForm=function(){
		$location.path('/');
	};
});
