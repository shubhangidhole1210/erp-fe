erpApp.controller('productDialogCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,product,action,flag,dialogueTitle,saveButtonAction){
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.product = product;
	$scope.dialogueTitle=dialogueTitle;
	var formdata = new FormData();
	$scope.getNotificationMsg =true;
	$scope.isSaveButtonHide = saveButtonAction;
	$scope.product.isBag = false;
	$scope.product.isBox = false;
	
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
	
	$scope.onSendOptionChanged = function(){
		console.log("sendOption :" , $scope.sendOption);
		if($scope.sendOption === "isBag"){
			$scope.product.isBag = true;
			$scope.product.isBox = false;
		}else if($scope.sendOption === "isBox"){
			$scope.product.isBag = false;
			$scope.product.isBox = true;

		}else{
			
		}
	};

	$scope.saveProduct = function(name,partNumber,clientPartNumber,description,cgst,sgst,igst,other1,other2,bagSize,boxSize,sendOption){
		formdata.append('name', $scope.product.name);
		formdata.append('partNumber', $scope.product.partNumber);
		formdata.append('clientPartNumber', $scope.product.clientPartNumber);
		formdata.append('description', $scope.product.description);
		formdata.append('cgst', $scope.product.taxStructureDTO.cgst);
		formdata.append('sgst', $scope.product.taxStructureDTO.sgst);
		formdata.append('igst', $scope.product.taxStructureDTO.igst);
		formdata.append('other1', $scope.product.taxStructureDTO.other1);
		formdata.append('other2', $scope.product.taxStructureDTO.other2);
		formdata.append('bagSize', $scope.product.bagSize);
		formdata.append('boxSize', $scope.product.boxSize);
		formdata.append('isBag', $scope.product.isBag);
		formdata.append('isBox', $scope.product.isBox);
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log("$scope.data:",$scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "product/create";
			httpparams.headers = {
					"Content-Type" : undefined,
					auth_token : Auth.getAuthToken()
				};
		} else {
			formdata.append('id', $scope.product.id);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "product/update";
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
								utils.showToast(data.data.message);
								console.log(data.data.message);
								utils.hideProgressBar();
							}else{
								$scope.displayProgressBar = false;
								console.log(data.data.message);
								utils.showToast(data.data.message);
								$rootScope.$emit("CallPopulateProductList",{});
								utils.hideProgressBar();
							}
						},
						function errorCallback(data) {
							utils.showToast('Something went worng. Please try again later.');
							utils.hideProgressBar();
						});
	};
	
	$scope.onNotificationListRecived = function(response){
		$scope.getNotificationMsg =false;
		$scope.notificationList = response.data;
	};
	
	$scope.getNotificationInformation = function(index){
		erpWSService.getList("notification/list:",$scope.onNotificationListRecived);
	};
	
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