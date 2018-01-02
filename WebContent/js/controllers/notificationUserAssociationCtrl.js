erpApp.controller('notificationUserAssociationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter) {
     
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	$scope.isNotificationPresent=false;
     $scope.notificationUser={};
     $scope.currentPage = 0;
     $scope.pageSize = 15;
     
    $scope.topDirections = ['left', 'up'];
 	$scope.bottomDirections = ['down', 'right'];

 	$scope.isOpen = false;

 	$scope.availableModes = ['md-fling', 'md-scale'];
 	$scope.selectedMode = 'md-scale';

 	$scope.availableDirections = ['up', 'down', 'left', 'right'];
 	$scope.selectedDirection = 'right';
     
	$rootScope.$on("CallPopulateNotificationList", function() {
		$scope.populateNotificationUserAssociationList();
	});
	
	$scope.onListReceived = function(response){
		$scope.notificationUserAssociationList=response.data.data;
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.notificationUserAssociationList.length < 16){
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
			$rootScope.$emit("CallPopulateNotificationList", {});
			utils.showToast("User Notification association deleted sucessfully");
		}
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.notificationUserAssociationList,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<notificationUserAssociationList.length; i++) {
		        $scope.notificationUserAssociationList.push("Item "+i);
		    }
	}

	
	$scope.populateNotificationUserAssociationList = function() {
	     erpWSService.getList("notificationuserassociation/list", $scope.onListReceived);
	};
	
	$scope.addNewNotificationUserAssociation = function(ev) {
		$scope.showDialog(ev, { notificationUser : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Notification User Association",
			saveButtonAction : true
		});
	};

	$scope.editNotificationUserAssociation = function(ev, $index) {
		$scope.showDialog(ev, { notificationUser : $scope.notificationUserAssociationList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			dialogueTitle : "Edit Notification User Association",
			saveButtonAction : true
		});
	};
	
	$scope.viewNotificationUserAssociationInformation = function(ev, $index) {
		$scope.showDialog(ev, { notificationUser : $scope.notificationUserAssociationList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : true,
			dialogueTitle : "View Notification User Association",
			saveButtonAction : false
        });
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'notificationUserAssociationDialogCtrl',
			templateUrl : 'views/notificationUserAssociationDialogue.html',
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
	
	$scope.deleteNotificationUserAssociation = function(index) {
		erpWSService.deleteItem("notificationuserassociation/delete/" + $scope.notificationUserAssociationList[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Notification User Association Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteNotificationUserAssociation(($scope.currentPage*$scope.pageSize) + ($index));
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
