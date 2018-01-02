erpApp.controller('rmQcGuideLineCtrl',
		function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, $location){
	
	$scope.hide = function() {
		console.log('hide DialogController');
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
	
	$scope.getQcGuideLine = function(){
	var httpparams = {};
	httpparams.method = 'GET';
	httpparams.url = SERVER_URL + "qcGuideline/list";
	httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
	$http(httpparams).then(function successCallback(response) {
		$scope.QualityCheckGuidelineList=response.data;
		console.log("$scope.QualityCheckGuidelineList:" ,$scope.QualityCheckGuidelineList);
	}, function errorCallback(response) {
		$scope.message = 
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
	});
};	
	
});