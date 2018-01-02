erpApp.controller('generateBomCtrl',function($scope, $mdDialog, $location,$rootScope,SERVER_URL,Auth,$http,utils,erpWSService){
	
	$scope.onProductRMassociationListRecived = function(response){
		$scope.productList = response.data.data;
		if( response.data.code === 0){
			utils.showToast(response.data.message);
		}
	};
	
	$scope.getProductRMAssociationList = function(){
		erpWSService.getList("productRMAsso/getProductList",$scope.onProductRMassociationListRecived);
	};
	
   $scope.onRawMaterialAssociationListRecived = function(response){
	   $scope.data = response.data;
		$scope.productRMList = response.data.data;
   };
   
   $scope.getRawMaterials = function(){
	   erpWSService.getList("productRMAsso/productRMAssoList/" +$scope.product.id, $scope.onRawMaterialAssociationListRecived);
   };

	$scope.getVenodrList = function(index,id) {
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL
				+ "rmvendorasso/rmVendorList/" + id;
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams).then(
				function successCallback(response) {
					$scope.productRMList[index].vendorList = response.data.data;
					console.log("response:",response);
					utils.hideProgressBar();
				}, function errorCallback(response) {
					console.log("Error");
					utils.hideProgressBar();
				});
		utils.showProgressBar();
	};
	
	$scope.submitBomInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveBomData();
		} else {
			utils.showToast('Please fill all required information');
		}
	};

	$scope.duplicateRM = function(rawMaterialVendorList) {
		console.log("in duplicate RM function");
		console.log("$scope.rawMaterialVendorList",
				$scope.rawMaterialVendorList);
		for (var i = 0; i < $scope.rawMaterialVendorList.length; i++) {
			if ($scope.rawMaterialVendorList[i].rawmaterial === rawMaterialVendorList.rawmaterial) {
				return true;
			}
		}
		return false;
	};
	
	$scope.onItemCreated = function(response){
		$scope.onResponseReceived(response); 
	};
	
	$scope.onResponseReceived = function(response){
		if(response.data.code === 1){
			utils.showToast(response.data.message);
			showConfirm();
		}else{
			utils.showToast(response.data.message);
			showConfirm();
		}
	};
	
	$scope.saveBomData = function() {
		console.log("in saveBomData function")
		console.log($scope.data.data);
		var index = 0;
		var rmVendorList = [];
		for (index = 0; index < $scope.productRMList.length; index++) {
			var rmVendor = {};
			rmVendor.rawmaterial = $scope.productRMList[index].rawmaterialId.id;
			rmVendor.pricePerUnit = $scope.productRMList[index].price;
			rmVendor.quantity = $scope.productRMList[index].quantity;
			rmVendor.vendor = $scope.productRMList[index].vendor.vendorId.id;
			rmVendorList.push(rmVendor)
		}
		var data = {
			product : $scope.product.id,
			bomModelParts : rmVendorList
		};
			erpWSService.createItem("bom/createmultiple", $scope.onItemCreated, data);
	};
	
	function showConfirm(ev){
		var confirm = $mdDialog.confirm().title('You want to download PDF for generating BOM')
		.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');
          $mdDialog.show(confirm)
		.then(function() {
			$location.path('/getPdf');
		  }, function() {});
	};
	
	$scope.onRawMaterialQuantityChange = function(index, quantity, pricePerUnit){
		console.log('onRawMaterialQuantityChange : ');
		$scope.productRMList[index].price = pricePerUnit * quantity;
		console.log('Price : ', $scope.productRMList[index].price);
	};
	
	$scope.cancelBomForm = function(){
		$location.path('/');
	};
	
});