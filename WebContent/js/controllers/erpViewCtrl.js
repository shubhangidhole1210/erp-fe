erpApp.controller('erpViewController', function($scope, $rootScope, Auth, SERVER_URL, $http, $location) {
	$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
		$rootScope.$on('logout', function($event){
			$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
		});
		$rootScope.$on('loginSuccess', function($event){
			$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
		});
});