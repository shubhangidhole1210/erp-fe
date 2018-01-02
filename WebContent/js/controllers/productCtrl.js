erpApp.controller('productCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,erpWSService,$location, $anchorScroll,$filter) {
	
	$scope.isProductPresent=false;
	$scope.product = {};
	$scope.isImagePopUp = false;
	$scope.isproductImagePresent= false;
	
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
	
	$rootScope.$on("CallPopulateProductList", function() {
		$scope.populteProductList();
	});
	
	$scope.onListReceived = function(response){
		$scope.products = response.data.data;
		console.log("products:" ,$scope.products);
		$scope.isProductInformation();
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.products.length < 16){
	    	 $scope.isPaginationBtnHide = false;
	     }else{
	    	 $scope.isPaginationBtnHide = true;
	     }
	};
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("CallPopulateProductList", {});
			utils.showToast("Product deleted sucessfully");
		}
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.products,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<products.length; i++) {
		        $scope.products.push("Item "+i);
		    }
	}
	$scope.populteProductList=function(){
	     erpWSService.getList("product/list", $scope.onListReceived);
	};
	
	$scope.isProductInformation = function() {
		$scope.isProductPresent = $scope.products.length === 0 ? true : false;
	};
	
	$scope.addNewProduct = function(ev) {
		$scope.showDialog(ev, { product : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Product",
			saveButtonAction : true
		});
	};
	
	$scope.editProductInformation = function(ev, $index) {
		$scope.showDialog(ev, { product : $scope.products[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : false,
			dialogueTitle : "Edit Product Information",
			saveButtonAction : true
      });
		console.log(" $scope.products[($scope.currentPage*$scope.pageSize) + ($index)]", $scope.products[($scope.currentPage*$scope.pageSize) + ($index)]);
	};
	
	$scope.viewProductInformation = function(ev, $index) {
		$scope.showDialog(ev, { product : $scope.products[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : true,
			dialogueTitle : "View Product Information",
			saveButtonAction : false	
      });
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'productDialogCtrl',
			templateUrl : 'views/productDialog.html',
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
	
	$scope.deleteProduct = function(index) {
		erpWSService.deleteItem("product/delete/" + $scope.products[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Product Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteProduct(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
	$scope.getImage = function($index){
		$scope.isImagePopUp = true;
		console.log("get image");
		console.log("$scope.products:",$scope.products);
		 var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL
					+ "product/image/"
					+ $scope.products[($scope.currentPage*$scope.pageSize) + ($index)].id;
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(
					function successCallback(response) {
						 $scope.imgData = response.data;
						 console.log("$scope.imgData:",$scope.imgData);
						//console.log(response);
						 $scope.dispalyImageMsg();
						utils.hideProgressBar();
					}, function errorCallback(response) {
					});
	};
	
	$scope.dispalyImageMsg = function(){
		if( $scope.imgData === ""){
			$scope.isproductImagePresent= true;
		}else{
			$scope.isproductImagePresent= false;
		}
	}
	
	
	$scope.cancelGuideLinePopUp = function(){
		$scope.isImagePopUp = false;
	}
	
	$scope.gotoPrevPage = function(){
		 $location.hash('tableHead');

	        $anchorScroll();
		 $scope.currentPage = $scope.currentPage - 1;
	};
	
	$scope.gotoNextPage = function(){
		 $location.hash('tableHead');

	        $anchorScroll();
		 $scope.currentPage = $scope.currentPage + 1;
	};
	
});
(window.angular)