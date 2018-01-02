erpApp.controller('ProgressBarController',function($scope,$rootScope) {
		$scope.displayProgressBar = false;
		
		$rootScope.$on("hide-progress-bar", function (event, args) {
			$scope.displayProgressBar = false;
        });
		
		$rootScope.$on("show-progress-bar", function (event, args) {
			$scope.displayProgressBar = true;
        });
		
});