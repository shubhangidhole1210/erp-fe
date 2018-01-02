erpApp.controller('userTypePageAssoCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter) {
	$scope.isVendorPredent =false;
	$scope.userTypePageAsso={};
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
	
	
	$rootScope.$on("callPopulateUserTypePageAsso", function() {
		$scope.populateUserTeypePageAsso();
	});
	
	$scope.onListReceived = function(response){
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
		$scope.userTypePageAssociations = response.data.data;
	};
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("callPopulateUserTypePageAsso", {});
			utils.showToast("User Type page association deleted successfully");
		}
	};
	
	$scope.populateUserTeypePageAsso = function() {
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
	     erpWSService.getList("usertypepageassociation/list", $scope.onListReceived);
	};
	
	$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.userTypePageAssociations,$scope.searchText);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<userTypePageAssociations.length; i++) {
		        $scope.userTypePageAssociations.push("Item "+i);
		    }
	};

	$scope.addNewUserTypePage = function(ev) {
		$scope.showDialog(ev, { userTypePageAsso : {},
			flag : FLAG_ADD,
			action : false,
			information : "Add New User Type Page",
			saveButtonAction : true
		});
	};
	  
	$scope.editUserTypePage = function(ev, $index) {
		$scope.showDialog(ev, { userTypePageAsso : $scope.userTypePageAssociations[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			information : "Edit User Type Page",
			saveButtonAction : true
		});
	};
	
	$scope.viewUserTypePage = function(ev, $index) {
		$scope.showDialog(ev, { userTypePageAsso : $scope.userTypePageAssociations[($scope.currentPage*$scope.pageSize) + ($index)],
								flag : FLAG_VIEW,
								action : true,
								information : "View User Type Page",
								saveButtonAction : false
		});
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'userTypePageDialogCtrl',
			templateUrl : 'views/userPageTypeAssoInfo.html',
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
	
	$scope.deleteUserTypePage = function(index) {
		erpWSService.deleteItem("usertypepageassociation/delete/" + $scope.userTypePageAssociations[index].id , $scope.onItemDeleted);
	};
	
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete User Type Page Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteUserTypePage(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
	
});
