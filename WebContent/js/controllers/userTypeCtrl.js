erpApp.controller('userTypeCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter)
{
	var FLAG_ADD  = 0,
		FLAG_EDIT = 1,
		FLAG_VIEW = 2;
	
	$scope.isReadOnly = false;
	$scope.userType = {};
	$scope.currentPage = 0;
    $scope.pageSize = 15;
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$rootScope.$on("CallPopulateUserTypeList", function($event) {
		$scope.populateUserTypeList	();
	});
	
	$scope.onListReceived = function(response){
		$scope.UserTypes = response.data.data;
		console.log($scope.UserTypes);
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.UserTypes.length < 16){
	    	 $scope.isPaginationPageHide = false;
	     }else{
	    	 $scope.isPaginationPageHide = true;
	     }
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.UserTypes,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<UserTypes.length; i++) {
		        $scope.UserTypes.push("Item "+i);
		    }
	};
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("CallPopulateUserTypeList", {});
			utils.showToast("User Type deleted successfully");
		}
	};
	
	$scope.populateUserTypeList = function() {
	     erpWSService.getList("usertype/list", $scope.onListReceived);
	};

	$scope.addNewUserType = function(ev) {
		$scope.showDialog(ev, { userType : {},
			flag : FLAG_ADD,
			action : false,
			information : "Add New User Type",
			saveButtonAction : true
		});
	};
	$scope.editUserTypeInformation = function(ev, $index) {
		$scope.showDialog(ev, { userType : $scope.UserTypes[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			information : "Edit User Type",
			saveButtonAction : true
		});
	};
	
	$scope.viewUserTypeInformation = function(ev, $index) {
		$scope.showDialog(ev, { userType : $scope.UserTypes[($scope.currentPage*$scope.pageSize) + ($index)],
								flag : FLAG_VIEW,
								action : true,
								information : "View User Type Information",
								saveButtonAction : false
		});
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'userTypeDialogCtrl',
			templateUrl : 'views/userTypeInformation.html',
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
	
	$scope.deleteUserType = function(index) {
		erpWSService.deleteItem("usertype/delete/" + $scope.UserTypes[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete User Type Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteUserType(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
});