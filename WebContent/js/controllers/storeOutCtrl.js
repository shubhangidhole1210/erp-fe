erpApp.controller('storeOutCtrl',function($scope, $http, $mdDialog, $mdToast,$rootScope, SERVER_URL,$filter,utils,Auth,$location,erpWSService)
{
	$scope.addProductRmAssociationMsg = false;
	$scope.currentDate = utils.getCurrentDate();
	$scope.isProduct = false;
	$scope.isSelectedItemStoreOut = false;
	$scope.productionPlan = {};
	$scope.selectedRawMaterialList = [];
	$scope.isProductionPlanPresent = false;
	$scope.isProductionPlanDisable = true;
	
	
	$scope.onProductionPlanListReceived = function(response){
		$scope.productionPlans = response.data.data;
		if(response.data.data.code === 1){
			console.log(response.data.data);
			utils.showToast("There is no any production planning list ! you can update production plan for current date")
		}else{
			console.log(response.data.data);
		}
		$scope.isProductOrderPresent();
	};
	
	$scope.getProductionPlanForStoreOut = function(){
		  erpWSService.getList("productionplanning/getProductionPlanListByDate/" +$scope.currentDate, $scope.onProductionPlanListReceived);
	};
	
	$scope.displayProductionPlanmsg = function(){
		if('There is no any production planning list ! you can update production plan for current date' === 'There is no any production planning list ! you can update production plan for current date'){
			$scope.isProductionPlanPresent = true;
			$scope.isProductionPlanDisable = false;
		}else{
			$scope.isProductionPlanPresent = false;
			$scope.isProductionPlanDisable = true;
		}
	}
	
	$scope.isProductOrderPresent = function(){
		$scope.isProduct = $scope.productionPlans.length ===0?true : false;
	};
	
	
	
	/*$scope.getProductRMAssociation = function(){
		
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListForStoreOutByDateAndPId/"  + $scope.currentDate + "/" + + $scope.productionPlan.productId.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			
			if(response.data.code === 0){
				utils.showToast(response.data.message);
				$scope.addProductRmAssociationMsg = true;
				console.log("response:",response);
				if(response.data.data === null){
					$scope.message = response.data.message;
				}
			}else{
				$scope.productRMList = response.data.data;
				console.log("$scope.productRMList:",$scope.productRMList);
				$scope.manuFactureQuantity = $scope.productionPlan.targetQuantity;
				$scope.updateDispatchQuantity();
				$scope.addProductRmAssociationMsg = false;
				$scope.message = response.data.message;
			}
			utils.hideProgressBar();

		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
	};*/
	
	$scope.onProductRMAssociationListRecived = function(response){
		if(response.data.code === 0){
			utils.showToast(response.data.message);
			$scope.addProductRmAssociationMsg = true;
			console.log("response:",response);
			if(response.data.data === null){
				$scope.message = response.data.message;
			}
		}else{
			$scope.productRMList = response.data.data;
			console.log("$scope.productRMList:",$scope.productRMList);
			$scope.manuFactureQuantity = $scope.productionPlan.targetQuantity;
			$scope.updateDispatchQuantity();
			$scope.addProductRmAssociationMsg = false;
			$scope.message = response.data.message;
		}
	};
	
	$scope.getProductRMAssociation = function(){
		erpWSService.getList("productionplanning/getProductionPlanListForStoreOutByDateAndPId/"  + $scope.currentDate + "/" + + $scope.productionPlan.productId.id,$scope.onProductRMAssociationListRecived)
	};
	
	$scope.updateDispatchQuantity = function(){
		for(index=0;index<$scope.productRMList.length;index++){
			$scope.productRMList[index].quantityDispatched = $scope.productRMList[index].quantityRequired * $scope.manuFactureQuantity;
		}
	};
	
	$scope.onItemCreated = function(response){
		$scope.onResponseReceived(response); 
	};
	
	$scope.onResponseReceived = function(response){
		if(response.data.code === 1){
			$location.path('/');
			utils.showToast(response.data.message);
		}else{
			utils.showToast(response.data.message);
		}
	};
	
	$scope.saveStoreOutInformation = function(ev) {
		var rmList = [];
		var index=0;
		if($scope.isSelectedItemStoreOut){
			var rmList = $scope.selectedRawMaterialList;
			console.log("if block");
		}else{
			for(index=0;index<$scope.productRMList.length;index++){
				var storeOutProduct = {};
				storeOutProduct.rawmaterial = $scope.productRMList[index].rawmaterial;
				storeOutProduct.quantityRequired = $scope.productRMList[index].quantityRequired;
				storeOutProduct.quantityDispatched = $scope.productRMList[index].quantityDispatched;
				rmList.push(storeOutProduct);
				console.log("else block");
			}
		}
		var data = {
				productId: $scope.productionPlan.productId.id,
				productionPlanId :$scope.productionPlan.id,
				quantityRequired: $scope.manuFactureQuantity,
				isSelectedStoreOut: $scope.isSelectedItemStoreOut,
				description:$scope.description,
				storeOutParts:rmList
		};
			erpWSService.createItem("storeout/createStoreOut", $scope.onItemCreated, data);
	};
	
	$scope.onIsSelectedChange = function(isSelectedRawMaterial,$index){
		if(!isSelectedRawMaterial){
			if(isRawMaterialPresentInList($index)){
				$scope.selectedRawMaterialList.splice($index, 1);
			}
		}else{
			if(isRawMaterialPresentInList($index)){
			}else{
				var selectedStoreOutProduct = {};
				selectedStoreOutProduct.rawmaterial = $scope.productRMList[$index].rawmaterial;
				selectedStoreOutProduct.quantityDispatched = $scope.productRMList[$index].quantityDispatched;
				selectedStoreOutProduct.quantityRequired = $scope.productRMList[$index].quantityRequired;
				$scope.selectedRawMaterialList.push(selectedStoreOutProduct);
			}
		};
	};
	
	function isRawMaterialPresentInList(listIndex){
		var isRawMaterialPresent = false;
		for(index=0; index < $scope.selectedRawMaterialList.length;index++){
			if($scope.selectedRawMaterialList[index].rawmaterial === $scope.productRMList[listIndex].rawmaterial){
				isRawMaterialPresent = true;
				break;
			}
		}
		return isRawMaterialPresent;
	};
	
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveStoreOutInformation();
		} 
	};
	
	$scope.restInformation=function(){
		$location.path('/');
	};
	
	$scope.displayHiddenColumn = function(){
		$scope.ischeckBox = true;
	};
	
	});
