erpApp.controller('rmTypeCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter){
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	$scope.currentPage = 0;
    $scope.pageSize = 15;
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$scope.isRmTypePresent=false; 
	$scope.rmType={};
	
	$rootScope.$on("CallPopulateRmTypeList", function() {
		$scope.populateRmTypeList();
	});
	
	$scope.onListReceived = function(response){
		$scope.rmTypeList=response.data.data;
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.rmTypeList.length < 16){
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
			$rootScope.$emit("CallPopulateRmTypeList", {});
			utils.showToast("Raw Material type deleted sucessfully");
		}
	};
	
	$scope.populateRmTypeList = function() {
	     erpWSService.getList("rmtype/list", $scope.onListReceived);
	};
	
	$scope.isRmTypeInformation = function() {
		$scope.isRmTypePresent = $scope.rmTypeList.length === 0 ? true : false;
	};
	
	$scope.addNewRmType = function(ev) {
		$scope.showDialog(ev, { rmType : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Raw Material Type",
			saveButtonAction : true,
		});
	};
	
	$scope.editRMType = function(ev, $index) {
		$scope.showDialog(ev, { rmType : $scope.rmTypeList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			dialogueTitle : "Edit Raw Material Type",
			saveButtonAction : true,
		});
	};
	
	$scope.viewRMTypenformation = function(ev, $index){
		$scope.showDialog(ev, { rmType : $scope.rmTypeList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : true,
			dialogueTitle : "View Raw Material Type",
			saveButtonAction : false
        });
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.rmTypeList,$scope.searchText);
		 console.log("myFilteredData:",myFilteredData);
	 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<rmTypeList.length; i++) {
		        $scope.rmTypeList.push("Item "+i);
		    }
	}
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'rmTypeDialogueController',
			templateUrl : 'views/rmTypeDialoguehtml.html',
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
	
	$scope.deleteRmType = function(index) {
		erpWSService.deleteItem("rmtype/delete/" + $scope.rmTypeList[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Raw Material Type Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteRmType(($scope.currentPage*$scope.pageSize) + ($index));
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