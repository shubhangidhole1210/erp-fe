erpApp.controller('vedorCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter) {
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	$scope.isVendorPresent =false;
	$scope.vendor={};
	//$scope.isSaveButtonHide = false;
	
	$rootScope.$on("callPopulateVendorList", function() {
		$scope.populateVendorList();
	});
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	
	$scope.onListReceived = function(response){
		$scope.vendors = response.data.data;
		 $scope.isVendorInformation();
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	    
	     if($scope.vendors.length < 16){
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
			$rootScope.$emit("callPopulateVendorList", {});
			utils.showToast("Vendor deleted successfully");
		}
	};
	
	$scope.populateVendorList = function() {
	     erpWSService.getList("vendor/list", $scope.onListReceived);
	};
	
	$scope.isVendorInformation = function() {
		$scope.isVendorPresent = $scope.vendors.length === 0 ? true : false;
	};
	$scope.addNewVendor = function(ev) {
		$scope.showDialog(ev, { vendor : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Vendor",
			saveButtonAction : true
		});
	};
	  
	$scope.editVendorInformation = function(ev, $index) {
		$scope.showDialog(ev, { vendor : $scope.vendors[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			dialogueTitle : "Edit Vendor Indormation",
			saveButtonAction : true
		});
	};
	
	$scope.viewVendarInformation = function(ev, $index) {
		$scope.showDialog(ev, { vendor : $scope.vendors[($scope.currentPage*$scope.pageSize) + ($index)],
								flag : FLAG_VIEW,
								action : true,
								dialogueTitle : "View vendor Information",
								saveButtonAction : false
		});
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'DialogVendorController',
			templateUrl : 'views/vendorDialog.html',
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
	
	$scope.deleteVendor = function(index) {
		erpWSService.deleteItem("vendor/delete/" + $scope.vendors[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Vendor Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteVendor(($scope.currentPage*$scope.pageSize) + ($index));
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
