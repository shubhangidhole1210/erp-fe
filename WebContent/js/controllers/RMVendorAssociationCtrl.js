
erpApp.controller(
				'RMVendorCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,erpWSService,$location, $anchorScroll,$filter) {
					$scope.isReadOnly = false;
					$scope.isPresentvenodrAsso=false;
					$scope.isDropDownreadOnly = false;
					 $scope.currentPage = 0;
				     $scope.pageSize = 15;
				     $scope.rmVendorAssociation = {};
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
					
					$rootScope.$on("CallPopulateRMVendorAssociationList", function() {
						$scope.populateRMVendorAssociationList();
					});
					
					$scope.onListRecived = function(response){
						 $scope.data = response.data.data;
						$scope.rmVendorAssociations = response.data.data;
						$scope.currentPage = 0;
					     $scope.pageSize = 15;
					     if($scope.rmVendorAssociations.length < 16){
					    	 $scope.isPaginationBtnHide = false;
					     }else{
					    	 $scope.isPaginationBtnHide = true;
					     }
					};
					
					/*$scope.totalNoOfPages = function(){
						 var myFilteredData = $filter('filter')($scope.rmVendorAssociations,$scope.searchText);
						 return Math.ceil(myFilteredData.length/$scope.pageSize);
						 for (var i=0; i<rmVendorAssociations.length; i++) {
						        $scope.rmVendorAssociations.push("Item "+i);
						    }
					}*/

					$scope.populateRMVendorAssociationList = function(){
						  erpWSService.getList("rmvendorasso/list", $scope.onListRecived);
					};
					
					$scope.onItemDeleted = function(response){
						if(response.data.code === 0){
							utils.showToast('Something went worng. Please try again later.')

						}else{
							$scope.displayProgressBar = false;
							$rootScope.$emit("CallPopulateRMVendorAssociationList",{});
							utils.showToast("Raw Material Vendor Association deleted successfuly");
						}
					};
		
					$scope.isRMVendorAssociationInformation = function() {
						$scope.isPresentvenodrAsso = $scope.data.length === 0 ? true : false;
					};
					
					$scope.showDialog = function(ev, locals){
						$mdDialog.show({
							controller : 'RMVendorAssociationDialogCtrl',
							templateUrl : 'views/RMVendorDialog.html',
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
					
					$scope.addNewRMVendorAssociation = function(ev) {
						$scope.showDialog(ev, { rmVendorAssociation : {},
							flag : FLAG_ADD,
							action : false,
							dialogueTitle : "Add New RM Vendor Association Information ",
							dropdownAction : false,
							saveButtonAction : true
						});
					};
					
					$scope.editRMVendorAssociation = function(ev, $index) {
						$scope.showDialog(ev, { rmVendorAssociation : $scope.rmVendorAssociations[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_EDIT,
							action : false,
							dialogueTitle : "Edit RM Vendor Association Information",
							dropdownAction : true,
							saveButtonAction : true
						});
						console.log("$scope.rmVendorAssociations[($scope.currentPage*$scope.pageSize) + ($index)]:",$scope.rmVendorAssociations[($scope.currentPage*$scope.pageSize) + ($index)]);
					};
					
					$scope.viewRMVendorAssociation = function(ev, $index){
						$scope.showDialog(ev, { rmVendorAssociation : $scope.rmVendorAssociations[($scope.currentPage*$scope.pageSize) + ($index)],
							flag : FLAG_EDIT,
							action : true,
							dialogueTitle : "View RM Vendor Association Information",
							dropdownAction : true,
							saveButtonAction : false
						});
					};
					
					$scope.deleteRMVendorAssociation = function(index) {
						erpWSService.deleteItem("rmvendorasso/delete/" + $scope.rmVendorAssociations[index].id, $scope.onItemDeleted);
					};
					
					/*$scope.deleteRMVendorAssociation = function(index) {
						var httpparams = {};
						httpparams.method = 'delete';
						httpparams.url = SERVER_URL + "rmvendorasso/delete/" + $scope.rmVendorAssociations[index].id;
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(data) {
							utils.hideProgressBar();
							$rootScope.$emit("CallPopulateRMVendorAssociationList", {});
							console.log(data);
							if(data.data.code === 1){
								utils.showToast("Raw material vendor association deleted Successfully !");
							}else{
								utils.showToast("We are Sorry. Something went wrong. Please try again later.");
							}

						}, function errorCallback(data) {
							console.log("Error");

						});
						utils.showProgressBar();
					};*/
					
					/*$scope.showConfirm = function(ev,$index) {
						var confirm = $mdDialog.confirm().title(
								'Are you sure you want to Delete Raw Material Vendor Association Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');
						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteRMVendorAssociation(($scope.currentPage*$scope.pageSize) + ($index));
										},
										function() {
											$scope.status = 'You decided to keep your debt.';
										});
					};*/
					
					$scope.showConfirm = function(ev,$index) {
						var confirm =  $mdDialog.confirm()
												.title('Are you sure you want to Delete RM Vendor Association Information?')
												.ariaLabel('')
												.targetEvent(ev)
												.ok('Yes' )
												.cancel('No');

						$mdDialog.show(confirm)
								.then(function() {
									$scope.deleteRMVendorAssociation(($scope.currentPage*$scope.pageSize) + ($index));
								}, function() {});
					};
					
					$scope.gotoPrevPage = function(){
						 $location.hash('tableHead');
						 $scope.currentPage = $scope.currentPage - 1;
					};
					
					$scope.gotoNextPage = function(){
						 $location.hash('tableHead');
					        $anchorScroll();
						 $scope.currentPage = $scope.currentPage + 1;
					};
					
				});
