erpApp.controller('rawMaterialDialogCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,flag,action,information,rawMaterial,$location,unitAction,erpWSService,saveButtonaction) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.rawMaterial = rawMaterial;
	$scope.information= information;
	$scope.isUnitReadOnly = unitAction;
	$scope.isUnit = false
	var formdata = new FormData();
	$scope.isSaveButtonHide = saveButtonaction;
	
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
	
	$scope.saveRawMaterial = function(rmName,description,partNumber,pricePerUnit,unitId,rmTypeId){
		formdata.append('rmName', $scope.rawMaterial.rmName);
		formdata.append('description', $scope.rawMaterial.description);
		formdata.append('partNumber', $scope.rawMaterial.partNumber);
		formdata.append('pricePerUnit', $scope.rawMaterial.pricePerUnit);
		formdata.append('rmTypeId', $scope.rawMaterial.rmTypeId.id);
		formdata.append('unitId', $scope.rawMaterial.unitId.id);
		var httpparams = {};
		//console.log("$scope.rawMaterial.unitId.id:",$scope.rawMaterial.unitId);
		if ($scope.flag == 0) {
			console.log("$scope.data:",$scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "rawmaterial/create";
			httpparams.headers = {
					"Content-Type" : undefined,
					auth_token : Auth.getAuthToken()
				};
		} else {
			formdata.append('id', $scope.rawMaterial.id);
			console.log(" $scope.rawMaterial.id:", $scope.rawMaterial.id);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "rawmaterial/update";
			httpparams.headers = {
					"Content-Type" : undefined,
					auth_token : Auth.getAuthToken()
				};
		}
		httpparams.data = formdata;
		httpparams.transformRequest = angular.identity;
    	httpparams.withCredentials = false;
		$http(httpparams)
				.then(
						function successCallback(data) {
							$mdDialog.hide();
							console.log(data);
							if(data.data.code === 0){
								utils.showToast('Something went worng. Please try again later.');
								utils.hideProgressBar();
							}else{
								$scope.displayProgressBar = false;
								utils.showToast(data.data.message);
								console.log("message:",data.data.message);
								$rootScope.$emit("populateRawMaterialList",{});
								utils.hideProgressBar();
							}
						},
						function errorCallback(data) {
							utils.showToast('Something went worng. Please try again later.');
							utils.hideProgressBar();
						});
		
		
	};
  $scope.onUnitListRecived = function(response){
	  $scope.unitList = response.data.data;
	  console.log("  $scope.unitList:",  $scope.unitList);
  };
  
  $scope.getUnitList= function(){
	  erpWSService.getList("unit/list", $scope.onUnitListRecived);
  }

	$scope.onRmListRecived = function(response){
		$scope.rmTypeList = response.data.data;
	}
	
	$scope.getRmTypeList= function(){
		 erpWSService.getList("rmtype/list", $scope.onRmListRecived);
	}
	
	
	 $scope.getTheFiles = function ($files) {
	        angular.forEach($files, function (value, key) {
	            formdata.append('file', value);
	            console.log($files);
	            $scope.uploadImg = $files;
	            console.log(" $scope.uploadImg :" , $scope.uploadImg);
	            console.log(formdata);
	        });
	    };
	
});