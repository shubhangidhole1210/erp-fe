 erpApp.service('fileUploadService', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, clientPartNumber, uploadUrl){
        var myFormData = new FormData();

        myFormData.append('file', file);
        myFormData.append('clientPartNumber', clientPartNumber);
        
        var httpparams = {};
    	httpparams.method = 'post';
    	httpparams.url = SERVER_URL + "fileupload";
    	httpparams.data = formdata;
    	

        $http.post(uploadUrl, myFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
            	auth_token : Auth.getAuthToken()}
        })
            .success(function(){

            })
            .error(function(){
            });
    }
}]);