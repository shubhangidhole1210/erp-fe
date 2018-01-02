erpApp.controller('userTypePageDialogCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL, utils, Auth, userTypePageAsso, $location,flag, action, information,erpWSService,saveButtonAction) {
					$scope.userTypePageAsso = userTypePageAsso;
					$scope.flag = flag;
					$scope.isReadOnly = action;
					$scope.information = information;
					$scope.userPages = [];
					$scope.userPage = {};
					$scope.isSaveButtonDisable = true;
					$scope.isSaveButtonHide = saveButtonAction;

					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};
					
					$scope.onItemCreated = function(response){
						$scope.onResponseReceived(response); 
					};
					
					$scope.onItemUpdated = function(response){
						$scope.onResponseReceived(response);
					};
					
					$scope.onResponseReceived = function(response){
						if (response.data.code === 0) {
							utils.showToast("Something went worng. Please try again later.");
						} else if (response.data.code === 2) {
							utils.showToast(response.data.message);
						} else {
							utils.showToast(response.data.message);
							$rootScope.$emit("callPopulateUserTypePageAsso",{});
							$scope.hide();
						}
					};
					
					$scope.saveUserTypePageInformation = function() {
						var data = {
								userTypePageAssoParts : $scope.userPages,
								usertypeId : $scope.userTypePageAsso.usertypeId.id
						};
						if ($scope.flag == 0) {
							
							erpWSService.createItem("usertypepageassociation/createMultiple", $scope.onItemCreated, data);
						} else {
							data.id = $scope.unit.id;
							erpWSService.updateItem("usertypepageassociation/update", $scope.onItemUpdated, data);
						}
						
					};
					
					$scope.submitUserTypePageInformation = function(id,pageId){
						console.log("id :",id);
						console.log("pageId :",pageId);
						console.log("$scope.userPage:",$scope.userPages);
						if(id == null && pageId == null){
							utils.showToast("please select User type and page")
						}else if(id == null){
							utils.showToast("Please select user type")
						}else if($scope.userPages == null){
							utils.showToast("Please add atlest one page")
						}else{
							$scope.saveUserTypePageInformation();
						}
					};
					
					$scope.onUserTypeListRecived = function(response){
						$scope.userTypes = response.data.data;
					};
					
					$scope.getUserTypeList = function(){
						erpWSService.getList("usertype/list", $scope.onUserTypeListRecived);
					}

					$scope.onPageListRecived = function(response){
						$scope.pages = response.data.data;
					};
				
					$scope.getPageList = function(){
						erpWSService.getList("page/list", $scope.onPageListRecived);
					}
					

					$scope.addPages = function() {
						if (!angular.equals($scope.userPage, {})) {
							if (!$scope.isDuplicatePage($scope.userPage)) {
								$scope.userPages.push($scope.userPage);
								$scope.userPage = {};
								$scope.userTypePageInformtion.page
										.$setValidity("message", true);
								$scope.message = "";
							} else {
								$scope.message = 'This Page is already added';
								console.log("else block");
								$scope.userTypePageInformtion.page
										.$setValidity("message", false);
							}
						}
						$scope.toDisabledSaveButton();
						console.log("$scope.userPage:",$scope.userPages);
					};
					
					console.log("$scope.userPage:",$scope.userPages);
					
					$scope.toDisabledSaveButton = function(){
							if($scope.userPages.length ===0){
								$scope.isSaveButtonDisable = true;
							}else{
								$scope.isSaveButtonDisable = false;
							}
					};
					
					$scope.onPageChange = function(){
						$scope.userTypePageInformtion.page.$setValidity("message", true);
					};
					
					$scope.isDuplicatePage = function(userPage) {
						for (var i = 0; i < $scope.userPages.length; i++) {
							if ($scope.userPages[i].pageId === userPage.pageId) {
								return true;
							}
						}
						return false;
					};

					$scope.deletePage = function(index) {
						$scope.userPages.splice(index, 1);
					};
					
					$scope.onUserTypeIdListRecived = function(response){
						$scope.userPageAssociation = response.data.data;
					};
					
					$scope.getUserTypeId = function(){
						erpWSService.getList("usertypepageassociation/UserTypePageAsso/" + $scope.userTypePageAsso.usertypeId.id, $scope.onUserTypeIdListRecived);
					};

				});