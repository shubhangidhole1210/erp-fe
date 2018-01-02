erpApp.controller('qualityInspectionCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, $location,$log,erpWSService) {
	$scope.ischeckBoxDisabled = true;
	 $scope.gridOptions = {};
	 $scope.isGuideLinePopUp = false;
	 $scope.isGuideLinePresent = false;
	
	document.getElementById('invoiceNumber').focus();
	
	$scope.resetQualityInspectionForm = function(){
		$scope.invoiceId = "";
		$scope.rmInvoiceList = [];
		$scope.description = "";
		$scope.getRMOrderInvoiceInformation();
		$scope.isInvoice = false;
		$scope.isInvoiceDisabled = false;
	};
	
	$scope.onRMOrderInvoiceListRecived = function(response){
		$scope.invoiceList = response.data.data;
		console.log("$scope.invoiceList:",$scope.invoiceList);
		$scope.isInvoicePresent();
	};
	
	$scope.getRMOrderInvoiceInformation = function(){
		erpWSService.getList("rawmaterialorderinvoice/security-in-invoices", $scope.onRMOrderInvoiceListRecived);
	}
	
	$scope.isInvoicePresent = function(){
		if($scope.invoiceList === null){
			$scope.isInvoice = true;
			$scope.isInvoiceDisabled = true;
		}else{
			$scope.isInvoice = false;
			$scope.isInvoiceDisabled = false;
		}
	};
	
	$scope.onInvoiceRawMaterialListRecived = function(response){
		$scope.rmInvoiceList = response.data.data;
		console.log("response:",response);
	};
	
	$scope.invoiceRawMaterialList = function(){
		erpWSService.getList("qualitycheckrawmaterial/listrm/" + $scope.invoiceId , $scope.onInvoiceRawMaterialListRecived);
	};

	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveQualityinspectionInformation();
		} else {
			utils.showToast('Please fill all required information');
		}
	};

	$scope.resetQualityInspection = function() {
		$location.path('/');
	};
	
	$scope.onItemCreated = function(response){
		$scope.onResponseReceived(response); 
	};
	
	$scope.onResponseReceived = function(response){
		if(response.data.code === 1){
			$location.path('/');
			utils.showToast('Raw Material quality check Successfully !');
			//utils.hideProgressBar();
		}else{
			utils.showToast(response.data.message);
		//	utils.hideProgressBar();
		}
		$scope.resetQualityInspectionForm();
	};
	
	
	$scope.saveQualityinspectionInformation = function(ev) {
		var index = 0;
		for (index = 0; index < $scope.rmInvoiceList.length; index++) {
			$scope.rmInvoiceList[index].intakeQuantity = $scope.rmInvoiceList[index].quantity;
		}
		var data = {
				description : $scope.description,
				id : $scope.invoiceId,
				qualityCheckRMDTOs : $scope.rmInvoiceList
		};
			erpWSService.createItem("qualitycheckrawmaterial/qualitycheck", $scope.onItemCreated, data);
	};
	
	$scope.checkReceivedQuantity = function(index) {
		if ($scope.rmInvoiceList[index].quantity === parseInt($scope.rmInvoiceList[index].goodQuantity)) {
			$scope.rmInvoiceList[index].isReturnInvoiceInitated = false;
			$scope.rmInvoiceList[index].ischeckBoxDisabled = true;
		} else if ($scope.rmInvoiceList[index].quantity <= parseInt($scope.rmInvoiceList[index].goodQuantity)) {
			$scope.rmInvoiceList[index].isReturnInvoiceInitated = false;
			$scope.rmInvoiceList[index].ischeckBoxDisabled = true;
		}else if ($scope.rmInvoiceList[index].goodQuantity > 0){
			$scope.rmInvoiceList[index].isReturnInvoiceInitated = true;
			$scope.rmInvoiceList[index].ischeckBoxDisabled = false;
		}
		else {
			$scope.rmInvoiceList[index].isReturnInvoiceInitated = true;
			$scope.rmInvoiceList[index].ischeckBoxDisabled = false;
		}
	};
	
	
	$scope.onGuideLineList = function(response){
		$scope.rmQCGuidelineList = response.data.data;
		$scope.isGuideLinePresentForRm();
	};
	
	$scope.shoGuideLinePopUp = function(index){
	 $scope.isGuideLinePopUp = true;
		erpWSService.getList("qcGuideline/rm/" + $scope.rmInvoiceList[index].id, $scope.onGuideLineList);
	}
	
	$scope.cancelGuideLinePopUp = function(){
		$scope.isGuideLinePopUp = false;
	}
	
	/*$scope.iGuideLinePresentForRm = function(response) {
		console.log("in cancel guideline pop up $scope.rmQCGuidelineList :",$scope.rmQCGuidelineList);
		if($scope.rmQCGuidelineList === 'There is no quality check guidlines for this Raw Material'){
			 $scope.isGuideLinePresent = true;
		}else{
			$scope.isGuideLinePresent = false;
		}
	};*/
	
	$scope.isGuideLinePresentForRm = function(){
		if($scope.rmQCGuidelineList === null){
			 $scope.isGuideLinePresent = true;
		}else{
			$scope.isGuideLinePresent = false;
		}
	};

});
