erpApp.controller('productionPlanCtrl', function($scope, $http, $mdDialog,utils,
		 $rootScope, SERVER_URL, Auth , $location,$log, $filter) {
	$scope.gridOptions = {};
//	$scope.gridOptions.enableCellEditOnFocus = true;
	$scope.gridOptions.columnDefs = [
//	                                 { name:'productId', width:150, pinnedLeft:true, enablePinning:false,enableCellEdit: false, },
	                                 { name:'productName', width:150, pinnedLeft:true,enableCellEdit: false, type: 'number' },
	                                 { name:'productTargetQty',displayName:'Target Qty', width:150, pinnedLeft:true,enableCellEdit: false, type: 'number'  },
	                                 { name:'productBalanceQty',displayName:'Balance Qty', width:150, pinnedLeft:true,enableCellEdit: false, type: 'number'  }
	                               ];
	$scope.currentDate = new Date();
	$scope.monthStart = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), 1);
	$scope.alldays = [];
	var index = 0;
	while ($scope.monthStart.getMonth() === $scope.currentDate.getMonth()) {
		var dateStr = $filter('date')($scope.monthStart, 'dd-MM-yyyy');
		$scope.gridOptions.columnDefs.push({ name:'productProductionPlan['+index+'].target_quantity', displayName:'T('+ dateStr + ')',enableCellEdit: true, width:150,type: 'number' });
		$scope.gridOptions.columnDefs.push({ name:'productProductionPlan['+index+'].achived_quantity', displayName:'A('+ dateStr + ')',enableCellEdit: false, width:150 });
		$scope.alldays.push(new Date($scope.monthStart));
		$scope.monthStart.setDate($scope.monthStart.getDate() + 1);
		index++;
	};
	
	$scope.getProductionPlanList = function() {
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanForCurrentMonth";
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams).then(function successCallback(response) {
			utils.hideProgressBar();
			$scope.products = response.data;
			console.log("$scope.products:",$scope.products);
			$scope.products_copy = angular.copy(response.data);
			console.log(response);
//			$scope.gridOptions.columnDefs = [
//			                                 { name:'productId', width:150, enablePinning:false },
//			                                 { name:'productName', width:150, pinnedLeft:true },
//			                                 { name:'action', width:100, pinnedRight:true  },
//			                                 { name:'productTargetQty', width:150  }];
//			
//			for(var index = 0; response.data[0].productProductionPlan.length; index ++){
//				$scope.gridOptions.columnDefs.push({ name:'productProductionPlan['+index+'].target_quantity', displayName:'T('+ response.data[0].productProductionPlan[index].productionDate + ')', width:150 });
//				$scope.gridOptions.columnDefs.push({ name:'productProductionPlan['+index+'].achived_quantity', displayName:'A('+ response.data[0].productProductionPlan[index].productionDate + ')', width:150 });
//			}
//			$scope.gridOptions.data = response.data;
			$scope.gridOptions.data = $scope.products;
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	$scope.createDefaultProductionPlan = function() {
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'POST';
		httpparams.url = SERVER_URL + "productionplanning/createProductionPlanMonthYear/" + utils.getCurrentMonthYearString();
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams).then(function successCallback(response) {
			utils.hideProgressBar();
			$scope.products = response.data;
			$scope.products_copy = angular.copy(response.data);
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	function isProductionPlanEqual(productProductionPlan1, productProductionPlan2){
		if(productProductionPlan1.target_quantity === productProductionPlan2.target_quantity && 
				productProductionPlan1.achived_quantity === productProductionPlan2.achived_quantity && 
				productProductionPlan1.dispatch_quantity === productProductionPlan2.dispatch_quantity){
			return true;
		}else{
			return false;
		}
	}
	
	$scope.submitProductionPlan = function(){
		for(var index =0; index < $scope.products.length; index++){
			var productProductionPlan = [];
			for(var index2 =0; index2 < $scope.products[index].productProductionPlan.length;index2++){
				if(!isProductionPlanEqual($scope.products[index].productProductionPlan[index2], $scope.products_copy[index].productProductionPlan[index2])){
					productProductionPlan.push($scope.products[index].productProductionPlan[index2]);
				}
			}
			$scope.products_copy[index].productProductionPlan = productProductionPlan;
		}
		console.log('modified', $scope.products_copy[index]);
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'PUT';
		httpparams.data = $scope.products_copy;
		httpparams.url = SERVER_URL + "productionplanning/updateProductionPlan";
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
		$http(httpparams).then(function successCallback(response) {
			utils.hideProgressBar();
			console.log(response);
			utils.showToast("Production Plan Update sucessfully");
			$location.path('/');
		}, function errorCallback(response) {
			console.log("Error");
			utils.showToast("Something went wrong. Please try again later.");
			utils.hideProgressBar();
		});
	};
	
	$scope.cancelProductionPlan = function(){
		$location.path('/');
	}
	
	// TODO Implement Web service call Create Default Production Plan
	// TODO Implement Notification to tell user that new Product is added to the Product List and add it to the Production Plan.
	// TODO Reload Production Plan after any change in Production Plan

});