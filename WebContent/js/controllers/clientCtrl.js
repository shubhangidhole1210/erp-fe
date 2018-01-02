erpApp
		.controller('clientCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,erpWSService,$filter) {
					
			        $scope.isReadOnly = false;
					$scope.isClientPresent=false;
					$scope.client = {};
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
					
					$rootScope.$on("CallPopulateClientList", function() {
						$scope.populateClientList();
					});
					
					$scope.onListReceived = function(response){
						$scope.data = response.data.data;
						$scope.clients = response.data.data;
						$scope.currentPage = 0;
					     $scope.pageSize = 15;
					     if($scope.clients.length < 16){
					    	 $scope.isPaginationBtnHide = false;
					     }else{
					    	 $scope.isPaginationBtnHide = true;
					     }
					};

					/*$scope.totalNoOfPages = function(){
						 var myFilteredData = $filter('filter')($scope.clients,$scope.searchText);
						 return Math.ceil(myFilteredData.length/$scope.pageSize);
						 for (var i=0; i<clients.length; i++) {
						        $scope.clients.push("Item "+i);
						    }
					}*/
				
					$scope.onItemDeleted = function(response){
						if(response.data.code === 0){
							utils.showToast('Something went worng. Please try again later.')

						}else{
							$scope.displayProgressBar = false;
							$rootScope.$emit("CallPopulateNotificationList", {});
							utils.showToast("Client Deleted sucessfully");
							$rootScope.$emit("CallPopulateClientList", {});
						}
					};
					
					$scope.populateClientList = function() {
						
					     erpWSService.getList("client/list", $scope.onListReceived);
					};

					$scope.isClientInfirmation = function() {
						$scope.isClientPresent = $scope.data.length === 0 ? true : false;
					};
				
					$scope.addNewClient = function(ev) {
						$scope.showDialog(ev, { client : {},
							flag : FLAG_ADD,
							action : false,
							dialogueTitle : "Add New Client",
							saveButtonAction : true,
							saveButtonDisabledAction : false
						});
					};
		   
					$scope.editClient = function(ev, $index) {
						$scope.showDialog(ev, { client : $scope.clients[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_EDIT,
							action : false,
							dialogueTitle : "Edit Client Information",
							saveButtonAction : true,
							
						});
					};

					$scope.viewClientInformation = function(ev, $index) {
						$scope.showDialog(ev, { client : $scope.clients[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_VIEW,
							action : true,
							dialogueTitle : "View  Client Information",
							saveButtonAction : false
						});
					};
					
					$scope.showDialog = function(ev, locals){
						$mdDialog.show({
							controller : 'clientDialogCtrl',
							templateUrl : 'views/clientDialog.html',
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
					
					$scope.deleteClient = function(index) {
						erpWSService.deleteItem("client/delete/" + $scope.clients[index].id , $scope.onItemDeleted);
					};
					
					$scope.showConfirm = function(ev,$index) {
						var confirm =  $mdDialog.confirm()
												.title('Are you sure you want to Delete Client Information?')
												.ariaLabel('')
												.targetEvent(ev)
												.ok('Yes' )
												.cancel('No');

						$mdDialog.show(confirm)
								.then(function() {
									$scope.deleteClient(($scope.currentPage*$scope.pageSize) + ($index));
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