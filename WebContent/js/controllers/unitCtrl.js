erpApp.controller('unitCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils, erpWSService,$filter)
{
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	$scope.isUnitInPresent=false; 
	$scope.unit={}
	$scope.isSaveButtonHide = true;
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$rootScope.$on("CallPopulateUnitList", function() {
		$scope.populateUnitList();
	});
	
	$scope.onListReceived = function(response){
		$scope.units=response.data.data;
		$scope.isUnitInformation();
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.units.length < 16){
	    	 $scope.isPaginationPageHide = false;
	     }else{
	    	 $scope.isPaginationPageHide = true;
	     }
		
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.units,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<units.length; i++) {
		        $scope.units.push("Item "+i);
		    }
	};
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("CallPopulateUnitList",{});
			utils.showToast("Unit deleted succesfully");
		}
	};
	
	$scope.populateUnitList=function(){
		
	     
	     erpWSService.getList("unit/list", $scope.onListReceived);
		
	};
	
	$scope.isUnitInformation = function() {
		$scope.isUnitInPresent = $scope.units.length === null ? true : false;
		console.log("is unit function");
	};
	
	$scope.addNewUnit = function(ev) {
		$scope.showDialog(ev, { unit : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Unit ",
			saveButtonAction : true
		});
	};
	
	$scope.editUnitInformation = function(ev, $index) {
		$scope.showDialog(ev, { unit : $scope.units[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			dialogueTitle : "Edit Unit Information",
			saveButtonAction : true
		});
	};
	
	$scope.viewUnitInformation = function(ev, $index){
		$scope.showDialog(ev, { unit : $scope.units[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : true,
			dialogueTitle : "View Unit Information",
			saveButtonAction : false
});
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'unitDialogCtrl',
			templateUrl : 'views/unitDialog.html',
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
	
	$scope.deleteUnit = function(index) {
		erpWSService.deleteItem("unit/delete/" + $scope.units[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Unit Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteUnit(($scope.currentPage*$scope.pageSize) + ($index));
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