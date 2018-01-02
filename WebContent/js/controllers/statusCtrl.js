erpApp.controller('statusCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$location, $anchorScroll,$filter){
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	 $scope.currentPage = 0;
     $scope.pageSize = 15;
	
	$scope.isStatusPresent=false;
	$scope.status={};
	$scope.isOpen = false;
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$rootScope.$on("callPopulateStatusList", function() {
		$scope.populateStatusList();
	});
	
	$scope.onListReceived = function(response){
		$scope.statuss=response.data.data;
		/* $scope.currentPage = 0;
	     $scope.pageSize = 15;*/
	     if($scope.statuss.length < 16){
	    	 $scope.isPaginationBtnHide = false;
	     }else{
	    	 $scope.isPaginationBtnHide = true;
	     }
	};
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$rootScope.$emit("callPopulateStatusList", {});
			utils.showToast("Status deleted succesfully");
		}
	};
	
	$scope.populateStatusList = function() {
	     erpWSService.getList("status/list", $scope.onListReceived);
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.statuss,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<statuss.length; i++) {
		        $scope.statuss.push("Item "+i);
		    }
	}

	$scope.addNewStatus = function(ev) {
		$scope.showDialog(ev, { status : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Status "
		});
	};
	  
	$scope.editStatusInformation = function(ev, $index) {
		$scope.showDialog(ev, { status : $scope.statuss[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			dialogueTitle : "Edit Status Information"
		});
	};
	
	$scope.viewStatusInformation = function(ev, $index) {
		$scope.showDialog(ev, { status : $scope.statuss[($scope.currentPage*$scope.pageSize) + ($index)],
								flag : FLAG_VIEW,
								action : true,
								dialogueTitle : "View Status Information"
		});
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'StatusDialogueController',
			templateUrl : 'views/statusDialog.html',
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
	
	/*$scope.deleteStatus = function(index) {
		erpWSService.deleteItem("status/delete/" + $scope.statuss[index].id , $scope.onItemDeleted);
	};*/
	
	$scope.deleteStatus = function(index) {
		erpWSService.deleteItem("status/delete/" + $scope.statuss[index].id , $scope.onItemDeleted);
	};
	
	/*$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Status Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteStatus(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};*/
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete status Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteStatus(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
	
	$scope.isStatusInformation = function() {
		$scope.isStatusPresent = $scope.data.length === 0 ? true : false;
	};
	
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