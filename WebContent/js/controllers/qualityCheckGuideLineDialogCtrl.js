erpApp.controller('qualityCheckGuidelineDialogCtrl',
		function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, QualityCheckGuideline, $location, flag, action, information, erpWSService) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.QualityCheckGuideline = QualityCheckGuideline;
	$scope.information = information;
	//$scope.selectedItem = 'rawmaterial';
			
	
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
	
	$scope.onRMListReceived = function(response){
		$scope.data = response.data.data;
		console.log("$scope.data:",$scope.data);
	};
	$scope.getRawMaterial=function(){
		 erpWSService.getList("rawmaterial/list", $scope.onRMListReceived);
	}
	

$scope.onProductListRecived=function(response){
	$scope.data = response.data.data;
};

$scope.getProductList=function(){
	 erpWSService.getList("product/list", $scope.onProductListRecived);
};

$scope.getProductOrRmList = function(selectedItem){
	$scope.selectedItem = selectedItem;
	$scope.selectedItem === 'rawmaterial' ? $scope.getRawMaterial() : $scope.getProductList();
}

$scope.onItemCreated = function(response){
	$scope.onResponseReceived(response); 
};

$scope.onItemUpdated = function(response){
	$scope.onResponseReceived(response);
};

$scope.onResponseReceived = function(response){
	if(response.data.code === 0){
		
		utils.showToast(response.data.message);
	}else{
		utils.showToast(response.data.message);
		$rootScope.$emit("CallPopulateGuideLineList",{});
		$scope.hide();
	}
};

$scope.saveQcGuideLineInformation = function(ev) {
	var productId = $scope.selectedItem === 'rawmaterial' ? 0 : $scope.id;
	
	var rmId = $scope.selectedItem === 'rawmaterial' ? $scope.id : 0;
	
	var data = {
			guidelines:$scope.QualityCheckGuideline.guidelines,
			rawMaterialId: rmId,
			productId : productId

	};
	console.log("$scope.QualityCheckGuideline.guidelines:",$scope.QualityCheckGuideline.guidelines);
	if ($scope.flag == 0) {
		
		erpWSService.createItem("qcGuideline/create", $scope.onItemCreated, data);
	} else {
		data.id = $scope.QualityCheckGuideline.id;
		erpWSService.updateItem("qcGuideline/update", $scope.onItemUpdated, data);
	}
};




	/*$scope.saveQcGuideLineInformation = function(ev) {
		
		var productId = $scope.selectedItem === 'rawmaterial' ? 0 : $scope.id;
		
		var rmId = $scope.selectedItem === 'rawmaterial' ? $scope.id : 0;
		
		var data = {
				guidelines:$scope.QualityCheckGuideline.guidelines,
				rawMaterialId: rmId,
				productId : productId

		};
		var httpparams = {};
		if ($scope.flag == 0) {
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "qcGuideline/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			data.id = $scope.QualityCheckGuideline.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "qcGuideline/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		}
		httpparams.data = data;
		$http(httpparams)
				.then(
						function successCallback(data) {
							$mdDialog.hide();
							if(data.code === 0){
								$scope.hide();
								utils.showToast(data.data.message);
								$rootScope.$emit(
										"saveGuideLineError", {});
							}else{
								$scope.displayProgressBar = false;
								utils.showToast(data.data.message);
								$rootScope.$emit("CallPopulateGuideLineList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveGuideLineError", {});
							$scope.hide();
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	};*/

	$scope.submitQcGuideLineInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveQcGuideLineInformation();
		} else {
			utils.showToast('Please fill all required information');
		}
	};
});