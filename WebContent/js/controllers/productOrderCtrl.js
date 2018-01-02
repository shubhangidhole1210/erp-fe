erpApp.controller('productOrderCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter) {
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	$scope.isClientReadOnly = false;
	$scope.isProductOrderPresent=false;
	$scope.productOrder={};
	$scope.currentDate = new Date
	$scope.currentPage = 0;
    $scope.pageSize = 15;
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	console.log("$scope.currentDate :" ,$scope.currentDate);
	
	$rootScope.$on("callPopulateProductOrderList", function() {
		$scope.populateProductOrderList();
	});
	
	$scope.onListReceived = function(response){
		$scope.productOrders = response.data.data;
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.productOrders.length < 16){
	    	 $scope.isPaginationBtnHide = false;
	     }else{
	    	 $scope.isPaginationBtnHide = true;
	     }
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.productOrders,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<productOrders.length; i++) {
		        $scope.productOrders.push("Item "+i);
		    }
	}
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("callPopulateProductOrderList", {});
			utils.showToast("Product Order deleted sucessfully");
		}
	};
	
	$scope.populateProductOrderList = function() {
	     erpWSService.getList("productorder/list", $scope.onListReceived);
	};
	
	$scope.onStatusListRecived = function(){
		$scope.statusList = response.data.data;
	};
	
	$scope.populateStatusList = function(){
		erpWSService.getList("status/list", $scope.onStatusListRecived);
	};
	
	$scope.onStatusTypeListRecived = function(response){
		$scope.rmOrderList = response.data.data;
	};
	
	$scope.getProductOrderListByStatus = function(){
		erpWSService.getList("status/type/" + $scope.status.statusName ,$scope.onStatusTypeListRecived);
	};
	
	$scope.isProductOrderInformation = function() {
		$scope.isProductOrderPresent = $scope.productOrders.length === 0 ? true : false;
	};
	
	$scope.dddNewProductOrder = function(ev) {
		
		$scope.showDialog(ev, { productOrder : {},
			flag : FLAG_ADD,
			action : false,
			hideAction :true,
			clientAction :false,
			dialogueTitle : "Add New Product Order",
			saveButtonAction : true
		});
		
	  };
	 
	  $scope.editProductOrderInformation = function(ev , $index) {
		  $scope.showDialog(ev, { productOrder : $scope.productOrders[($scope.currentPage*$scope.pageSize) + ($index)],
				flag : FLAG_EDIT,
				action : false,
				hideAction :false,
				clientAction :true,
				dialogueTitle : "Edit Product Order Information",
				saveButtonAction : true,
			});
		  
		  };
	  
		$scope.viewProductOrderrInformation = function(ev, $index) {
			  $scope.showDialog(ev, { productOrder : $scope.productOrders[($scope.currentPage*$scope.pageSize) + ($index)],
					flag : FLAG_EDIT,
					action : true,
					hideAction :false,
					clientAction :true,
					dialogueTitle : "View Product Order Information",
					saveButtonAction : false
				});
		};
		
		$scope.showDialog = function(ev, locals){
			$mdDialog.show({
				controller : 'productOrderDialogCtrl',
				templateUrl : 'views/productOrderDialog.html',
				parent : angular.element(document.body),
				targetEvent : ev,
				clickOutsideToClose : false,
				fullscreen : $scope.customFullscreen,
				locals : locals
			})
			.then(
					function(answer) {},
					function() {});
		};
		
		$scope.showConfirm = function(ev,$index) {
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete Product Order Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'YES' ).cancel('NO');
			$mdDialog.show(confirm).then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteProductOrder(($scope.currentPage*$scope.pageSize) + ($index));
							},
							function() { });
		};
		
		$scope.deleteProductOrder = function(index) {
			erpWSService.deleteItem("productorder/delete/" + $scope.productOrders[index].id , $scope.onItemDeleted);
		};
		
		$scope.showConfirm = function(ev,$index) {
			var confirm =  $mdDialog.confirm()
									.title('Are you sure you want to Delete Product Order Information?')
									.ariaLabel('')
									.targetEvent(ev)
									.ok('Yes' )
									.cancel('No');

			$mdDialog.show(confirm)
					.then(function() {
						$scope.deleteProductOrder(($scope.currentPage*$scope.pageSize) + ($index));
					}, function() {});
		};
		
		
		$scope.gotoPrevPage = function(){
			 utils.scrollToTop();
			 $scope.currentPage = $scope.currentPage - 1;
		};
		
		$scope.gotoNextPage = function(){
			 utils.scrollToTop();
			 $scope.currentPage = $scope.currentPage + 1;
		};
		
});
