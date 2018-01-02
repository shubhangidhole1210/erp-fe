erpApp.controller('rmOrderCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,erpWSService,$location, $anchorScroll,$filter) {
	$scope.isReadOnly = false;
	$scope.displayAddRM = true;
	$scope.isRMOrderPresent=false;
	$scope.isPriceReadOnly = false;
	$scope.isVendorId = false;
	$scope.isName = true;
	$scope.rmOrder = {};
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	$scope.isOpen = false;
	$scope.isRMOrder = false;
	$scope.isRequiredList = true;
	$scope.currentPage = 0;
    $scope.pageSize = 15;

	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$rootScope.$on("CallPopulateRMOrderList", function() {
		$scope.populateRMOrderList();
	});
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$rootScope.$emit("CallPopulateRMOrderList", {});
			utils.showToast("Raw material order deleted sucessfully");
		}
	};
	
	//$scope.isHidePaginationBtn = true;
	
	$scope.populateRMOrderList = function() {
		
	     erpWSService.getList("rawmaterialorder/list", $scope.onListReceived);
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.rmOrders,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<rmOrders.length; i++) {
		        $scope.rmOrders.push("Item "+i);
		    }
	}
	
	$scope.onListReceived = function(response){
		$scope.rmOrders = response.data.data;
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.rmOrders.length < 16){
	    	 $scope.isHidePaginationBtn = false;
	     }else{
	    	 $scope.isHidePaginationBtn = true;
	     }
	};

	$scope.onStatusListRecived = function(response){
		$scope.statusList = response.data.data;
	};
	
	$scope.populateStatusList = function(){
		  erpWSService.getList("status/list", $scope.onStatusListRecived);
	}
	
	$scope.onRmOrderSttausListRecived = function(response){
		$scope.rmOrderList = response.data.data;
	};
	
	$scope.getRMOrderListByStatus=function(){
		 erpWSService.getList("status/type/" + $scope.status.statusName , $scope.onRmOrderSttausListRecived);
	};
	
	$scope.isRMOrderListEmpty = function() {
		return ($scope.rmOrders && $scope.rmOrders.length === 0) ? true : false;
	};

	$scope.addNewRMOrder = function(ev) {
		$scope.showDialog(ev, { rmOrder : {},
			flag : FLAG_ADD,
			action : false,
			hideAction: true,
			priceAction: true,
			vendorAction : false,
			uiAction : false,
			nameAction : true,
			requiredListAction : true,
			dialogueTitle : "Add New Raw Material Order",
			saveButtonAction : true
		});
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'rmOrderDialogCtrl',
			templateUrl : 'views/RMOrderDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			fullscreen : $scope.customFullscreen,
			locals : locals,
			multiple: true,
			skipHide: true,
			autoWrap : false
		})
		.then(
				function() {
					console.log('Resolved');
				},
				function() {
					console.log('Rejected');
				});
	};
	
	$scope.editRMOrderInformation = function(ev, $index) {
		$scope.showDialog(ev, { rmOrder : $scope.rmOrders[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			hideAction: false,
			priceAction: true,
			vendorAction : true,
			nameAction : true,
			uiAction : true,
			requiredListAction : false,
			dialogueTitle : "Edit Raw material Order",
			saveButtonAction : true
		});
		
		console.log("$scope.rmOrders:",$scope.rmOrders);
	};
	
	$scope.viewRmOrderInformation  = function(ev, $index) {
		$scope.showDialog(ev, { rmOrder : $scope.rmOrders[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : true,
			hideAction: false,
			priceAction: true,
			vendorAction : true,
			nameAction : true,
			uiAction : true,
			requiredListAction : false,
			dialogueTitle : "Edit Raw material Order",
			saveButtonAction : false
		});
		console.log("$scope.rmOrders:",$scope.rmOrders);
	};
	
	$scope.deleteRmOrder = function(index) {
		erpWSService.deleteItem("rawmaterialorder/delete/" + $scope.rmOrders[index].id , $scope.onItemDeleted);
		
	};

	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete RM Order Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteRmOrder(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
	$scope.gotoPrevPage = function(){
		 $location.hash('tableHeader');
	        $anchorScroll()
		$scope.currentPage = $scope.currentPage - 1;
	};
	
	$scope.gotoNextPage = function(){
		 $location.hash('tableHeader');
	        $anchorScroll()
		$scope.currentPage = $scope.currentPage + 1;
	};
});
