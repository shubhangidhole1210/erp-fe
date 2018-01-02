erpApp.controller('userCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL, utils, Auth, erpWSService, $filter) {
					
	                $scope.isReadOnly = false;
					$scope.isUserUnavailable = false;
					$scope.user = {};
					$scope.isConfirmPasswordVisible = true;
					$scope.currentPage = 0;
				    $scope.pageSize = 15;
					
					var FLAG_ADD  = 0,
					FLAG_EDIT = 1,
					FLAG_VIEW = 2;
					
					$rootScope.$on("CallPopulateUserList", function($event) {
						$scope.populateUserList();
					});
				
					$scope.topDirections = ['left', 'up'];
					$scope.bottomDirections = ['down', 'right'];

					$scope.isOpen = false;

					$scope.availableModes = ['md-fling', 'md-scale'];
					$scope.selectedMode = 'md-scale';

					$scope.availableDirections = ['up', 'down', 'left', 'right'];
					$scope.selectedDirection = 'right';

					$scope.onListReceived = function(response){
						$scope.users = response.data.data;
						$scope.currentPage = 0;
					    $scope.pageSize = 15;
					     if($scope.users.length < 16){
					    	 $scope.isPaginationBtnHide = false;
					     }else{
					    	 $scope.isPaginationBtnHide = true;
					     }
					};;
					
					$scope.totalNoOfPages = function(){
						 var myFilteredData = $filter('filter')($scope.users,$scope.searchText);
						 return Math.ceil(myFilteredData.length/$scope.pageSize);
						 for (var i=0; i<users.length; i++) {
						        $scope.users.push("Item "+i);
						    }
					};
					
					$scope.onItemDeleted = function(response){
						if(response.data.code === 0){
							utils.showToast('Something went worng. Please try again later.')

						}else{
							$scope.displayProgressBar = false;
							$rootScope.$emit("CallPopulateUserList", {});
							utils.showToast("User deleted succesfully");
						}
					};
					
					$scope.populateUserList = function() {
					     erpWSService.getList("user/list", $scope.onListReceived);
					};
					
					$scope.isUserInformation = function() {
						$scope.isUserUnavailable = $scope.users.length === 0 ? true : false;
					};

					$scope.addNewUser = function(ev) {
						$scope.showDialog(ev, { user : {},
							flag : FLAG_ADD,
							action : false,
							passwordAction : true,
							dialogueTitle : "Add New User"
						});
					};
					  
					$scope.editUserInformation = function(ev, $index) {
						$scope.showDialog(ev, { user : $scope.users[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_EDIT,
							action : false,
							passwordAction : false,
							dialogueTitle : "Edit User Information"
						});
						console.log("$scope.users:",$scope.users);
						
					};
					
					$scope.viewUserInformation = function(ev, $index) {
						$scope.showDialog(ev, { user : $scope.users[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_VIEW,
							action : true,
							passwordAction : false,
							dialogueTitle : "View User Information"
						});
					};
					
					$scope.showDialog = function(ev, locals){
						$mdDialog.show({
							controller : 'userDialogCtrl',
							templateUrl : 'views/userDialog.html',
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
					
					$scope.deleteUser = function(index) {
						erpWSService.deleteItem("user/delete/" + $scope.users[index].id , $scope.onItemDeleted);
					};
					
					$scope.showConfirm = function(ev,$index) {
						var confirm =  $mdDialog.confirm()
												.title('Are you sure you want to Delete User Information?')
												.ariaLabel('')
												.targetEvent(ev)
												.ok('Yes' )
												.cancel('No');

						$mdDialog.show(confirm)
								.then(function() {
									$scope.deleteUser(($scope.currentPage*$scope.pageSize) + ($index));
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
