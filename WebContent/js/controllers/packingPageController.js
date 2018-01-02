erpApp.controller('packingPageController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter) {
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	$scope.isVendorPresent =false;
	$scope.barcode={};
	//$scope.isSaveButtonHide = false;
	
	$rootScope.$on("callPopulateBarcodedList", function() {
		$scope.populatePackageList();
	});
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	
	$scope.onListReceived = function(response){
		$scope.barcodedList = response.data.data;
		console.log("$scope.barcodedList:",$scope.barcodedList);
		// $scope.isVendorInformation();
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	    
	     if($scope.barcodedList.length < 16){
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
			$rootScope.$emit("callPopulateBarcodedList", {});
			utils.showToast("Vendor deleted successfully");
		}
	};
	
	$scope.populatePackageList = function() {
	     erpWSService.getList("barcodeTracker/list", $scope.onListReceived);
	};
	
	$scope.isVendorInformation = function() {
		$scope.isVendorPresent = $scope.vendors.length === 0 ? true : false;
	};
	$scope.addNewPackage = function(ev) {
		$scope.showDialog(ev, { barcode : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Packaging Information",
			saveButtonAction : true
		});
	};
	  
	$scope.editPackageInformation = function(ev, $index) {
		$scope.showDialog(ev, { barcode : $scope.barcodedList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			dialogueTitle : "Edit Packaging Information",
			saveButtonAction : true
		});
	};
	
	$scope.viewPackageInformation = function(ev, $index) {
		$scope.showDialog(ev, { barcode : $scope.barcodedList[($scope.currentPage*$scope.pageSize) + ($index)],
								flag : FLAG_VIEW,
								action : true,
								dialogueTitle : "View Packaging Information",
								saveButtonAction : false
		});
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'packingPageDialogController',
			templateUrl : 'views/packingPageDailog.html',
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
	
	$scope.deleteBarcoded = function(index) {
		erpWSService.deleteItem("barcodeTracker/delete/" + $scope.barcodedList[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Barcoded Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteBarcoded(($scope.currentPage*$scope.pageSize) + ($index));
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
