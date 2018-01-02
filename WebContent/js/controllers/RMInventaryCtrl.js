erpApp.controller('rmInventoryCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$filter){
					$scope.isReadOnly = false;
					$scope.isrmInventoryPresent=false;
					$scope.isRmVisible = false;
					$scope.rmInventory = {};
					$scope.currentPage = 0;
				     $scope.pageSize = 15;
				     $scope.isOpen = false;
					
					$scope.topDirections = ['left', 'up'];
					$scope.bottomDirections = ['down', 'right'];

					var FLAG_ADD  = 0,
					FLAG_EDIT = 1,
					FLAG_VIEW = 2;

					$scope.availableModes = ['md-fling', 'md-scale'];
					$scope.selectedMode = 'md-scale';

					$scope.availableDirections = ['up', 'down', 'left', 'right'];
					$scope.selectedDirection = 'right';
					
					$rootScope.$on("CallPopulateRMInventoryList", function() {
						$scope.populateRMInventoryList();
					});
					
					$scope.onListReceived = function(response){
						$scope.rmInventoryList = response.data.data;
						$scope.currentPage = 0;
					     $scope.pageSize = 15;
					     if($scope.rmInventoryList.length < 16){
					    	 $scope.isPaginationBtnHide = false;
					     }else{
					    	 $scope.isPaginationBtnHide = true;
					     }
					};
					
					$scope.totalNoOfPages = function(){
						 var myFilteredData = $filter('filter')($scope.rmInventoryList,$scope.searchText);
						 return Math.ceil(myFilteredData.length/$scope.pageSize);
						 for (var i=0; i<rmInventoryList.length; i++) {
						        $scope.rmInventoryList.push("Item "+i);
						    }
					};
					
					$scope.onItemDeleted = function(response){
						if(response.data.code === 0){
							utils.showToast('Something went worng. Please try again later.')

						}else{
							$scope.displayProgressBar = false;
							$rootScope.$emit("CallPopulateRMInventoryList", {});
							utils.showToast("Raw Material Inventory Deleted sucessfully");
						}
					};
					
					$scope.populateRMInventoryList = function() {
					     erpWSService.getList("rawmaterialinventory/list", $scope.onListReceived);
					};
					
					$scope.isRmInventoryInformation = function() {
						$scope.isrmInventoryPresent = $scope.rmInventoryList.length === 0 ? true : false;
					};
					
					$scope.addNewRMInventory = function(ev) {
						
						$scope.showDialog(ev, { rmInventory : {},
							flag : FLAG_ADD,
							action : false,
							rmAction : false,
							information : "Add New Raw Material Inventory Information",
							saveButtonAction : true
						});
					};
	
					$scope.editRMInventory = function(ev, $index) {
						$scope.showDialog(ev, { rmInventory : $scope.rmInventoryList[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_EDIT,
							action : false,
							rmAction : true,
							information : "Edit Raw Material Inventory Information",
							saveButtonAction : true
						});
					};

					$scope.viewRmInventory = function(ev, $index) {
						
						$scope.showDialog(ev, { rmInventory : $scope.rmInventoryList[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_VIEW,
							action : true,
							rmAction : true,
							information : "View Raw Material Inventory Information",
							saveButtonAction : false
						});
					
					};
					
					$scope.showDialog = function(ev, locals){
						$mdDialog.show({
							controller : 'RMInvenaryDialogeController',
							templateUrl : 'views/RMInventaryDialog.html',
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
					
					$scope.deleteRMInventory = function(index) {
						erpWSService.deleteItem("rawmaterialinventory/delete/" + $scope.rmInventoryList[index].id , $scope.onItemDeleted);
					};
					
					$scope.showConfirm = function(ev,$index) {
						var confirm =  $mdDialog.confirm()
												.title('Are you sure you want to Delete Raw Material Inventory Information?')
												.ariaLabel('')
												.targetEvent(ev)
												.ok('Yes' )
												.cancel('No');

						$mdDialog.show(confirm)
								.then(function() {
									$scope.deleteRMInventory(($scope.currentPage*$scope.pageSize) + ($index));
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