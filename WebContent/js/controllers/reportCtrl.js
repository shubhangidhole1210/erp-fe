	erpApp.controller('reportCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,$location) {
     $scope.isPagePresent=false;
     $scope.selectedReport = {};
     $scope.setreports = function(){
		$scope.reports = Auth.getReport();
	}
	
	$scope.fetchReportData = function(){
		var httpparams = {};
		httpparams.method = 'GET';
		console.log($scope.selectedReport);
		httpparams.url = SERVER_URL + "report/inputParameters/"+$scope.selectedReport.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			console.log(response);
			console.log("data",data);
		}, function errorCallback(response) {
			console.log("Error");
		})
	};
	
	
	$scope.submitReportQuery = function(){
		console.log('$scope.selectedReport : ', $scope.selectedReport);
		var httpparams = {};
		httpparams.data = {};
		httpparams.data.reportId = $scope.selectedReport.id;
		httpparams.data.reportType = 1;
		httpparams.data.data = [];
		for(var index=0; index < $scope.data.length ; index++){
			var item = $scope.data[index];
			console.log('item : ', item);
			var dataItem = {};
			dataItem.id = item.id;
			dataItem.value = item.value;
			httpparams.data.data.push(dataItem);
		}
		console.log('Request Body : ', httpparams.data);
		httpparams.method = 'POST';
		httpparams.url = SERVER_URL + "report/query";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			
		}, function errorCallback(response) {
			console.log("Error");
		})
	}
	
	$scope.cancelReportForm = function(){
		$location.path('/')
	};
});
