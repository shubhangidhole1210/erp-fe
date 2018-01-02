erpApp.controller('loginCtrl', function($scope, $location,$rootScope, $http, Auth, SERVER_URL,utils) {
	$scope.login = function(index) {
		var data = {
			userid : $scope.userid,
			password : $scope.password
		};
		$http({
			method : 'post',
			url : SERVER_URL + 'user/login',
			data : data
		}).then(function successCallback(data, headers) {
			console.log(data);
			utils.hideProgressBar();
			console.log($scope.userid);
			if(data.data.code == 1){
				var userInfo = {};
				userInfo.auth_token = data.headers('auth_token');
				userInfo.user = data.data.user.userid;
				Auth.setUser(userInfo);
				Auth.setMenu(data.data.data.pages);
				Auth.setReport(data.data.data.reports);
				$scope.$emit('loginSuccess',{});
				$rootScope.$emit("CallUserProfileList",{});
				$rootScope.$emit("ReportList",{});
				$location.path('/');
			}else if(data.data.code === 0){
				console.log("else if block")
				if(data.data.message === "Please enetr correct password"){
					console.log("please enter correct pass")
					$scope.passwordMsg = "Please enter correct password"
					$scope.loginForm.password.$setValidity("apiPasswordError", false);
				}else if(data.data.message === "Please enetr correct userId"){
					console.log("please enter correct user id")
					$scope.userIdMsg = "Please enter correct user name";
					$scope.loginForm.userName.$setValidity("apiUserIdError", false);
				}
			}
			
			else{
				console.log('Login has different code');
			}
			
			utils.showToast(data.data.message);
		}, function errorCallback(data) {
			utils.hideProgressBar();
			utils.showToast("We are sorry, Something went wrong. Please try again later ");
		});
	};
	
	$scope.submitLogin = function(isvaliduser) {
		if (isvaliduser) {
			utils.showProgressBar();
			$scope.login();
		} else {
			console.log('User Form is not valid');
		}
	};
	
	$scope.onUserIdChange = function(){
		$scope.loginForm.userName.$setValidity("apiUserIdError", true);
		$scope.loginForm.password.$setValidity("apiPasswordError", true);
	};
	
	$scope.onPasswordChange = function(){
		$scope.loginForm.userName.$setValidity("apiUserIdError", true);
		$scope.loginForm.password.$setValidity("apiPasswordError", true);
	};
	
	$scope.isPasswordForget = function(){
		$location.path('forgetPassword');
	};
	
});
