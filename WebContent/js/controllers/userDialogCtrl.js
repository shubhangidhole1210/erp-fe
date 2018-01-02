erpApp.controller('userDialogCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL, utils, Auth, user, $location, flag, action,dialogueTitle,passwordAction,erpWSService) {
					
	                $scope.isReadOnly = action;
					$scope.isConfirmPasswordVisible = passwordAction;
					$scope.flag = flag;
					$scope.user = user;
					$scope.user.dob = new Date($scope.user.dob);
					$scope.user.doj = new Date($scope.user.doj);
					$scope.isUserType = false;
					$scope.isUserTypeDisabled = true;
					$scope.isUserTypeSelectionMsg = false;
					$scope.isUserIdPresent= false;
					$scope.dialogueTitle = dialogueTitle;
					$scope.inputType = 'password';
					
					$scope.hide = function() {
						$mdDialog.hide();
					};

					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};
					
					$scope.showConfirmPass= function(password){
						$scope.isConfirmPasswordVisible = true;
					};
					
					$scope.hideShowPassword = function(){
					    if ($scope.inputType === 'password'){
					    	 $scope.inputType = 'text';
					    }else{
					    	  $scope.inputType = 'password';
					    }
					  };

					$scope.validateBirthDate = function(dob) {
						$scope.today = new Date();
						var minAge = 18;
						$scope.minAge = new Date($scope.today.getFullYear()
								- minAge, $scope.today.getMonth(), $scope.today
								.getDate());
						if (dob > $scope.minAge) {
							$scope.userInformation.dob.$setValidity(
									"invalidDOBMsg", false);
						} else {
							$scope.userInformation.dob.$setValidity(
									"invalidDOBMsg", true);
						}
					};
					
					$scope.validateConfirmPassword = function(password,confirmPassword){
						if(password === confirmPassword){
							$scope.userInformation.confirmPassword.$setValidity("passwordMsg", true);
						}else{
							$scope.userInformation.confirmPassword.$setValidity("passwordMsg", false);
						}
					};

					$scope.validateJoiningDate = function(dob, doj) {
						var currentDate = new Date();
						var maxAge = 18;
						$scope.maxAge = new Date(dob.getFullYear() + maxAge,
								dob.getMonth(), dob.getDate());
						if (doj >= currentDate) {
							$scope.invalidDOJMsg = "Invalid date!! Joining date should not be in future";
							$scope.userInformation.doj.$setValidity(
									"customMsg", false);
						} else if (doj <= $scope.maxAge) {
							$scope.invalidDOJMsg = "Invalid date!! Joining date should be 18 year greater then Birth date";
							$scope.userInformation.doj.$setValidity(
									"customMsg", false);
						} else {
							$scope.userInformation.doj.$setValidity(
									"customMsg", true);
						}
					};
					
					$scope.displayUserTypeMsg = function(userType){
						if(userType === null){
							console.log("if condition");
						}else{
							console.log("else condition");
						}
					};
					
					$scope.onItemCreated = function(response){
						$scope.onResponseReceived(response); 
					};
					
					$scope.onItemUpdated = function(response){
						$scope.onResponseReceived(response);
					};
					
					$scope.onResponseReceived = function(response){
						console.log(response);
						if (response.data.code === 0) {
							utils.showToast('Something went worng. Please try again later.');
						}else if(response.data.code === 2){
						 if(response.data.message === "Email already exists !"){
								console.log("email areay exist");
								utils.showToast("email already exist");
								$scope.emailIdApiErrorMsg = "email already exist";
								$scope.userInformation.email.$setValidity("emailIdError", false);
							}else if(response.data.message === "UserId already exists !"){
								console.log("user id already exist");
								utils.showToast("user id already exist");
								$scope.userIdApiErrorMsg = "user id already exist";
								$scope.userInformation.userid.$setValidity("userIdError", false);
							}else if(response.data.message === "Mobile number already exists !"){
								console.log("Mobile number already exists");
								utils.showToast("Mobile number already exists");
								$scope.mobileNoApiErrorMsg = "Mobile number already exists";
								$scope.userInformation.mobile.$setValidity("mobileNoApiError",false)
							}else{}
						}else {
							$rootScope.$emit("CallPopulateUserList",{});
							console.log(response.data.message);
							utils.showToast(response.data.message);
							$scope.hide();
							
						}
					};
					
					$scope.onChangeUserId = function(){
						$scope.userInformation.userid.$setValidity("userIdError", true);
					};
					
					$scope.onChangeMobileNo = function(){
						$scope.userInformation.mobile.$setValidity("mobileNoApiError",true)
					};
					
					$scope.onChangeEmail = function(){
						$scope.userInformation.email.$setValidity("emailIdError", true);
					};
					
					$scope.saveUserInformation = function(ev) {
						var data = {
								    userId : $scope.user.userId,
								    password: $scope.user.password,
								    firstName : $scope.user.firstName,
								    lastName : $scope.user.lastName,
								    mobileNo : $scope.user.mobileNo,
								    emailId : $scope.user.emailId,
								    userTypeDTO : $scope.user.userTypeDTO.id,
									doj : $scope.user.doj,
									dob : $scope.user.dob
						};
						if ($scope.flag == 0) {
							erpWSService.createItem("user/create", $scope.onItemCreated, data);
						} else {
							data.id = $scope.user.id;
							erpWSService.updateItem("user/update", $scope.onItemUpdated, data);
						}
					};

					$scope.submitInformation = function(isvaliduser, $event){
						if (isvaliduser) {
							$scope.saveUserInformation();
						} else {
							utils.showToast('Please fill all required information');
							$scope.displayUserTypeMsg()
						}
					};

					$scope.onListReceived = function(response){
						$scope.userTypes = response.data.data;
					};
					
					$scope.getUserType = function() {
					     erpWSService.getList("usertype/list", $scope.onListReceived);
					};
		});
