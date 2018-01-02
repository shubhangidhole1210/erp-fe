erpApp.controller('productInventoryCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils ,erpWSService,$filter) {
	
	
	$scope.isProductInventoryPresent=false;
	$scope.isProductreadOnly = false;
	$scope.productInventory={};
	$scope.currentPage = 0;
    $scope.pageSize = 15;
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$rootScope.$on("callPopulateProductInventoryList", function() {
		$scope.populateProductInventoryList();
	});
	
	$scope.onListReceived = function(response){
		$scope.data = response.data;
		$scope.productInventorys = response.data.data;
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.productInventorys.length < 16){
	    	 $scope.isPaginationBtnHide = false;
	     }else{
	    	 $scope.isPaginationBtnHide = true;
	     }
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.productInventorys,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<productInventorys.length; i++) {
		        $scope.productInventorys.push("Item "+i);
		    }
	}
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("callPopulateProductInventoryList", {});
			utils.showToast("Product Inventory deleted sucessfully");
		}
	};
	
	$scope.populateProductInventoryList = function() {
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
	     erpWSService.getList("productinventory/list", $scope.onListReceived);
	};
	
	$scope.isProductInventoryinformation=function(){
		$scope.isProductInventoryPresent= $scope.data.length === 0  ? true:false;
	};
	
	$scope.addNewProductInventory = function(ev) {
		$scope.showDialog(ev, { productInventory : {},
			flag : FLAG_ADD,
			action : false,
			productAction : false,
			dialogueTitle : "Add New Product Inventory",
			saveButtonAction : true
		});
	  };
	  
	  $scope.editProductInventoryInformation = function(ev , $index) {
		  $scope.showDialog(ev, { productInventory : $scope.productInventorys[($scope.currentPage*$scope.pageSize) + ($index)],
				flag : FLAG_EDIT,
				action : false,
				productAction : true,
				dialogueTitle : "Edit Product Inventory",
				saveButtonAction : true
			});
		  };
		
		$scope.viewProductInventoryInformation = function(ev, $index) {
			$scope.showDialog(ev, { productInventory : $scope.productInventorys[($scope.currentPage*$scope.pageSize) + ($index)],
				flag : FLAG_VIEW,
				action : true,
				productAction : true,
				dialogueTitle : "View Product Inventory",
				saveButtonAction : false
         });
			console.log("$scope.productInventorys:",$scope.productInventorys);
		};
		
		
		$scope.showDialog = function(ev, locals){
			$mdDialog.show({
				controller : 'productInventoryDialogController',
				templateUrl : 'views/productInventoryDialog.html',
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
		
		
		$scope.deleteProductInventory = function(index) {
			erpWSService.deleteItem("productinventory/delete/" + $scope.productInventorys[index].id , $scope.onItemDeleted);
		};
		
		$scope.showConfirm = function(ev,$index) {
			var confirm =  $mdDialog.confirm()
									.title('Are you sure you want to Delete Product Inventory Information?')
									.ariaLabel('')
									.targetEvent(ev)
									.ok('Yes' )
									.cancel('No');

			$mdDialog.show(confirm)
					.then(function() {
						$scope.deleteProductInventory(($scope.currentPage*$scope.pageSize) + ($index));
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

