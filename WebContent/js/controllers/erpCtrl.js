erpApp.controller('ERPController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location) {
	$scope.userId= '';
	if(Auth.isLoggedIn()){
		$scope.userId = Auth.getUserName();
		$scope.displayUserName = true;
		$scope.displayLogoutButton = true;
	}else{
		$scope.displayUserName = false;
		$scope.displayLogoutButton = false;
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayLogoutButton=Auth.isLoggedIn();
		$scope.displayUserName=Auth.isLoggedIn();
		$location.path('/login');
	});
	
	
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayUserName = Auth.isLoggedIn();
		$scope.displayLogoutButton = Auth.isLoggedIn();
		$scope.userId = Auth.getUserName();
	});	
	
	$scope.logOut=function(){
		Auth.logout();
		$rootScope.$emit("logout",{});
	};
});

