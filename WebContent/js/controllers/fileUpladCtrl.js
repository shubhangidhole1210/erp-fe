erpApp.controller('fileUplodCtrl',function($scope,$http,SERVER_URL,Auth,erpWSService)
{   
	var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            formdata.append('file', value);
           // formdata.append('file', value);
            console.log($files);
            console.log(formdata);
            console.log("value" ,value);
        });
   
       
      
    };
    $scope.populateRawMaterials = function() {
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
	     erpWSService.getList("rawmaterial/list", $scope.onListReceived);
	};
	
	
    
    $scope.uploadFiles = function (clientno) {
    	 //$scope.getTheFiles($files);
    	 formdata.append('clientPartNumber', $scope.clientno);
    	var httpparams = {};
    	httpparams.method = 'post';
    	httpparams.url = SERVER_URL + "fileupload";
    	httpparams.data = formdata;
    	httpparams.headers = {
    			"Content-Type" : undefined,
				auth_token : Auth.getAuthToken()
			};
    	httpparams.transformRequest = angular.identity;
    	httpparams.withCredentials = false;
    	$http(httpparams)
		.then(
				function successCallback(response) {
					console.log(response);
				},
				function errorCallback(response) {
					//console.log(error)
				});
    };
});	
