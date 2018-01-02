erpApp.controller('productRMAssociationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter) {
	
	
	$scope.isProductRmAssociationPresent=false; 
	$scope.productRmAssociation={};
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
	
	$rootScope.$on("callPopulateProductRmAssociationList", function() {
		$scope.populateProductRmAssoList();
	});
	
	$scope.onListReceived = function(response){
		$scope.productRmAssociationList=response.data.data;
		$scope.productRMAssociationModelParts = response.data.productRMAssociationModelParts;
		if(response.data.code === 2){
			utils.showToast(response.data.message);
		}
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.productRmAssociationList.length < 16){
	    	 $scope.isPaginationBtnHide = false;
	     }else{
	    	 $scope.isPaginationBtnHide = true;
	     }
	};
	
	/*$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.productRmAssociationList,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<productRmAssociationList.length; i++) {
		        $scope.productRmAssociationList.push("Item "+i);
		    }
	}*/
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("callPopulateProductRmAssociationList", {});
			utils.showToast("Product RM Assciation Deleted sucessfully");
		}
	};
	
	$scope.populateProductRmAssoList = function() {
		
	     erpWSService.getList("productRMAsso/list/multiple", $scope.onListReceived);
	};
	
	$scope.productRmAssociationInformation = function() {
		$scope.isProductRmAssociationPresent = $scope.productRmAssociationList.length === 0 ? true : false;
	};
	
	$scope.addNewProductRMAssociation = function(ev) {
		$scope.showDialog(ev, { productRmAsso : {},
			flag : FLAG_ADD,
			action : false,
			productAction : false,
			information : "Add New Product RM Association",
			saveButtonAction : true
		});
	  };
	  
	  $scope.editproductRMAssociation = function(ev , $index) {
		  $scope.showDialog(ev, { productRmAsso : $scope.productRmAssociationList[($scope.currentPage*$scope.pageSize) + ($index)],
				flag : FLAG_EDIT,
				action : false,
				productAction : true,
				information : "Edit Product RM Association",
				saveButtonAction : true
			});
		  console.log("edit $scope.productRmAssociationList:",$scope.productRmAssociationList);
		  };
	  

		
		$scope.viewproductRMAssociationInformation = function(ev, $index) {
			$scope.showDialog(ev, { productRmAsso : $scope.productRmAssociationList[($scope.currentPage*$scope.pageSize) + ($index)],
				flag : FLAG_VIEW,
				action : true,
				productAction : true,
				information : "View Product RM Association",
				saveButtonAction : false
              });
		};
		
		$scope.showDialog = function(ev, locals){
			$mdDialog.show({
				controller : 'productRmAssociationDialogController',
				templateUrl : 'views/productRMAssociationDialog.html',
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
		
		
		$scope.deleteProductRMAssociation = function(index) {
			erpWSService.deleteItem("productRMAsso/delete/multiple/" + $scope.productRmAssociationList[index].product , $scope.onItemDeleted);
		};
		
		$scope.showConfirm = function(ev,$index) {
			var confirm =  $mdDialog.confirm()
									.title('Are you sure you want to Delete Product RM Association Information?')
									.ariaLabel('')
									.targetEvent(ev)
									.ok('Yes' )
									.cancel('No');

			$mdDialog.show(confirm)
					.then(function() {
						$scope.deleteProductRMAssociation(($scope.currentPage*$scope.pageSize) + ($index));
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

