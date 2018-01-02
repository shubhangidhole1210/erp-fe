erpApp.controller('notificationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter) {
    
	$scope.isNotificationPresent=false;
     $scope.notification={};
     
     var FLAG_ADD  = 0,
		FLAG_EDIT = 1,
		FLAG_VIEW = 2;
     $scope.currentPage = 0;
     $scope.pageSize = 15;
     
	$rootScope.$on("CallPopulateNotificationList", function() {
		$scope.populateNotificationList();
	});
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$scope.onListReceived = function(response){
		$scope.notificationList=response.data.data;
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.notificationList.length < 16){
	    	 $scope.isPaginationBtnHide = false;
	     }else{
	    	 $scope.isPaginationBtnHide = true;
	     }
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.notificationList,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<notificationList.length; i++) {
		        $scope.notificationList.push("Item "+i);
		    }
	}

	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("CallPopulateNotificationList", {});
			utils.showToast("Notification Deleted sucessfully");
		}
	};
	
	$scope.populateNotificationList = function() {
	     erpWSService.getList("notification/list", $scope.onListReceived);
	};
	
	$scope.isNotificationInformation = function() {
		$scope.isNotificationPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.addNewNotification = function(ev) {
		$scope.showDialog(ev, { notification : {},
			flag : FLAG_ADD,
			action : false,
			dialogueTitle : "Add New Notification",
			saveButtonAction : true,
		});
	};

	$scope.editNotification = function(ev, $index) {
		$scope.showDialog(ev, { notification : $scope.notificationList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			dialogueTitle : "Edit Notification Information",
			saveButtonAction : true
		});
	};
	
	$scope.viewNotificationInformation = function(ev, $index) {
		$scope.showDialog(ev, { notification : $scope.notificationList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : true,
			dialogueTitle : "View Notification Information",
			saveButtonAction : false
        });
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'notificationDialogCtrl',
			templateUrl : 'views/notificationDialog.html',
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
	
	$scope.deleteNotification = function(index) {
		erpWSService.deleteItem("notification/delete/" + $scope.notificationList[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Notification Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteNotification(($scope.currentPage*$scope.pageSize) + ($index));
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
