erpApp.controller('prodcutQualityCheckCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope, SERVER_URL, Auth, utils, $location, erpWSService){
	 $scope.currentDate = new Date();
	  $scope.selectedProductionPlan = {};
	  $scope.reamrk = '';
	  $scope.currentDate = utils.getCurrentDate();
	  $scope.isGuideLinePopUp = false;
	  $scope.productQualityMsg = false;
	  $scope.isGuideLinePresent = false;
	  $scope.isQualityCheckButton =true;
	  $scope.isProjectPrsentForQualitycheck = false;
	//  $scope.isProductPresentMsg = yrue;
	  
	
	  $scope.onProductlistRecived = function(response){
		  $scope.productionPlans = response.data.data;
		 // console.log("$scope.productionPlans:",$scope.productionPlans);
		  if(response.data.data.length === 0){
			  $scope.message = response.data.message;
		  }
		  $scope.onHideActionbutton();
//		  $scope.displayMsg();
		
	  }
	  
	  
	  $scope.getProductionPlanByDate=function(){
		
		  erpWSService.getList("productquality/getQualityPendingListByDate/"+ $scope.currentDate, $scope.onProductlistRecived);
	  };
	  
	  $scope.onHideActionbutton = function(){
		  console.log("$scope.productionPlans:",$scope.productionPlans);
		  if($scope.productionPlans.length === 0){
			  $scope.isQualityCheckButton =false;
			  $scope.isProjectPrsentForQualitycheck = true;
		  }else{
			  $scope.isQualityCheckButton =true;
			  $scope.isProjectPrsentForQualitycheck = false;
		  }
	  };
	  
	 /* $scope.getProductionPlanByDate=function(){
		  utils.showProgressBar();
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productquality/getQualityPendingListByDate/"+ $scope.currentDate;
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(function successCallback(response) {
				utils.hideProgressBar();
				$scope.productionPlans = response.data;
				 $scope.displayMsg();
			}, function errorCallback(response) {
				utils.hideProgressBar();
			});
	  };*/
	  
	  
	  /*$scope.displayMsg = function(){
		  $scope.productQualityMsg = $scope.productionPlans.length === 0 ? true : false;
		  $scope.isQualityCheckButton = $scope.productionPlans.length === 0 ? false : true;
	  }*/
	
	$scope.validatePassAndFailQuantity = function(qualityPendingQuantity, passQuantity, failQuantity1, $index){
		$scope.passFailQuantity = passQuantity + failQuantity1 ;
		if(qualityPendingQuantity == $scope.passFailQuantity){
			$scope.productQualityForm["failQuantity" + $index].$setValidity("customMsg", true);
		}else{
			$scope.productQualityForm["failQuantity" + $index].$setValidity("customMsg", false);
		}
	};  
	 
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveProductQuality();
		} else {
		}
	};
	
	$scope.onResponseReceived = function(response){
		if(response.data.code === 1){
			utils.showToast("Product Quality Check sucessfully!");
			$location.path('/');
			//utils.hideProgressBar();
		}else{
			utils.showToast("Something went wrong. Please try again later");
			//utils.hideProgressBar();
		}
	};
	
	$scope.saveProductQuality = function() {
		 var index=0;
			var productQualityParts = [];
			for(index=0;index<$scope.productionPlans.length;index++){
				var product = {};
				product.productId= $scope.productionPlans[index].productId.id;
				product.productQuantity = $scope.productionPlans[index].targetQuantity;
				product.passQuantity = $scope.productionPlans[index].passQuantity;
				product.failQuantity = $scope.productionPlans[index].failQuantity1;
				product.remark = $scope.productionPlans[index].remark;
				product.productionPlanId = $scope.productionPlans[index].id;
				productQualityParts.push(product);
			}
		 var data = {
				 productQualityParts:productQualityParts
		 };
			erpWSService.createItem("productquality/productQualityCheck", $scope.onResponseReceived, data);
	};
	
	

	/*$scope.saveProductQuality=function()
		{
			 var index=0;
				var productQualityParts = [];
				for(index=0;index<$scope.productionPlans.length;index++){
					var product = {};
					product.productId= $scope.productionPlans[index].productId.id;
					product.productQuantity = $scope.productionPlans[index].targetQuantity;
					product.passQuantity = $scope.productionPlans[index].passQuantity;
					product.failQuantity = $scope.productionPlans[index].failQuantity1;
					product.remark = $scope.productionPlans[index].remark;
					product.productionPlanId = $scope.productionPlans[index].id;
					productQualityParts.push(product);
				}
			 var data = {
					 productQualityParts:productQualityParts
			 };
			 utils.showProgressBar();
				var httpparams = {};
				httpparams.method = 'POST';
				httpparams.url = SERVER_URL + "productquality/productQualityCheck";
				httpparams.data = data;
				httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
				$http(httpparams).then(function successCallback(data) {
					if(data.data.code === 1){
						utils.showToast("Product Quality Check sucessfully!");
						$location.path('/');
					}else{
						utils.showToast("Something went wrong. Please try again later.");
					}
					utils.hideProgressBar();
					
				}, function errorCallback(response) {
					utils.showToast("Something went wrong. Please try again later.");
					utils.hideProgressBar();
				});
		};*/
		
		$scope.cancelProductQualityForm = function(){
			$location.path('/');
		};
		
		
		$scope.showProductGuideLine = function(index){
			$scope.isGuideLinePopUp = true;
			 var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL
						+ "qcGuideline/product/"
						+ $scope.productionPlans[index].productId.id;
				httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
				$http(httpparams).then(
						function successCallback(response) {
							$scope.productQCGuidelineList = response.data.data;
							console.log("response",response);
							console.log("$scope.productQCGuidelineList:",$scope.productQCGuidelineList);
							$scope.iGuideLinePresentForProduct();
							utils.hideProgressBar();
						}, function errorCallback(response) {
						});
		};
		
		$scope.cancelGuideLinePopUp = function(){
			$scope.isGuideLinePopUp = false;
		};
		
		$scope.iGuideLinePresentForProduct = function(){
			if($scope.productQCGuidelineList === null){
				  $scope.isGuideLinePresent = true;
			}else{
				  $scope.isGuideLinePresent = false;
			}
		};
		
		
		
		/*$scope.productQCGuidelineList = function() {
			if($scope.rmQCGuidelineList === 'There is no quality check guidlines for this product'){
				 $scope.isGuideLinePresent = true;
			}else{
				$scope.isGuideLinePresent = false;
			}
		};*/
});
		