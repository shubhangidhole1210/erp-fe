erpApp.controller('approvalController',function($scope, $http) {
	
	$scope.populateApprovalList=function(){
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = "approvalDetails.json";
		$http(httpparams).then(function successCallback(response) {
			console.log(response)
			$scope.approvalData = response.data.approvalDetails;
			console.log("$scope.approvalData :",$scope.approvalData);
		}, function errorCallback(response) {
				console.log("Error");
		});
	};
	
	
});