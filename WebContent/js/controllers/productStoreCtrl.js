erpApp.controller('productStoreCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils, $location,erpWSService){
	 $scope.currentDate = new Date();
	  $scope.selectedProductionPlan = {};
	  $scope.QCPassQuantity = 0;
	  $scope.QCFailQuantity = 0;
	  $scope.reamrk = '';
	  $scope.currentDate = utils.getCurrentDate();
	  $scope.noPrductOrderPresent = false;
	  $scope.isButtonHide = true;
	  $scope.isSaveButtonDisabled = true;
	 
	  $scope.onProductionPlanListRecived = function(response){
		  $scope.productionPlans = response.data.data;
		  $scope.displayQualityCheckCeationMsg();
		  $scope.isRecordAvailable();
	  };
	  
	  $scope.getProductionPlanByDate=function(){
		  erpWSService.getList("productionplanning/getProductionPlanReadyListByDate/" + $scope.currentDate, $scope.onProductionPlanListRecived);
	  };
	  
	  $scope.isRecordAvailable = function(){
		  if($scope.productionPlans.length === 0){
			  $scope.isSaveButtonDisabled = true;
		  }else{
			  $scope.isSaveButtonDisabled = false;
		  }
	  };
	  
	  $scope.displayQualityCheckCeationMsg = function(){
		  $scope.noPrductOrderPresent = $scope.productionPlans.length === null ? true : false;
		  $scope.isButtonHide = $scope.productionPlans.length === null ? false : true;
	  };
	
	  $scope.submitProductStoreInformation = function(isvaliduser, $event) {
			if (isvaliduser) {
				$scope.saveProductStoreInformation();
			} else {
				utils.showToast('Please fill all required information');
			}
		};
		
		$scope.onItemCreated = function(response){
			$scope.onResponseReceived(response); 
		};
		
		$scope.onResponseReceived = function(response){
			if(response.data.code === 1){
				$location.path('/');
				utils.showToast("Product Store sucessfully!");
			}else{
				utils.showToast("Something went wrong. Please try again later.");
			}
		};
		
		$scope.validatePassQuantity = function(packedQuantity,passQuantity,$index){
			console.log("packedQuantity:",packedQuantity);
			console.log("passQuantity:",passQuantity);
			if(packedQuantity === passQuantity){
				console.log("if block");
				$scope.productStoreForm["passQuantity" + $index].$setValidity("passQuanityMsg", true);
			}else{
				$scope.productStoreForm["passQuantity" + $index].$setValidity("passQuanityMsg", false);
				console.log("else block");
			}
		}
		
		$scope.saveProductStoreInformation = function(ev) {
			 var index=0;
				var productQualityParts = [];
				for(index=0;index<$scope.productionPlans.length;index++){
					var product = {};
					product.productId= $scope.productionPlans[index].productId.id;
					product.productQuantity = $scope.productionPlans[index].targetQuantity;
					product.packedQuantity = $scope.productionPlans[index].packedQuantity;
					product.failQuantity = $scope.productionPlans[index].failQuantity;
					product.remark = $scope.productionPlans[index].remark;
					product.productionPlanId = $scope.productionPlans[index].id;
					productQualityParts.push(product);
				}
			 var data = {
					 productQualityParts:productQualityParts
			 };
				erpWSService.createItem("productquality/productQualityCheckStore", $scope.onItemCreated, data);
		};
	  
	
		
		$scope.isQualityCheckQuantityEqualToPassQuantity = function(qualityCheckedQuantity,passQuantity,$index){
			if(qualityCheckedQuantity === passQuantity){
				$scope.productStoreForm["passQuantity" + $index].$setValidity("passQuanityMsg", true);
			}else{
				$scope.productStoreForm["passQuantity" + $index].$setValidity("passQuanityMsg", false);
			}
		};
		
		$scope.cancelProductStore=function(){
			$location.path('/');
		};
});
		