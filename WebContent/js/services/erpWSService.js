erpApp.service('erpWSService',function erpWSService(utils, Auth, SERVER_URL, $http , $mdDialog){
	
	this.getHTTPParams = function (method, url, data, headers){
		var requestBody = {};
		
		//create your request body here and return object
		requestBody.method = method;
		requestBody.url = SERVER_URL + url;
		requestBody.headers = this.getHTTPRequestHeader();
		requestBody.data = data;
		return requestBody;
	};
	this.getHTTPRequestBody = function(){
		var data = {};
		
		return data;
	};
	this.getHTTPRequestHeader = function (){
		var headers = {
				auth_token : Auth.getAuthToken()
		};
		return headers;
	};
	
	
	
	this.getList = function(urlPath, callback){
		utils.showProgressBar();
		var httpparams = this.getHTTPParams('GET',urlPath);
		
		$http(httpparams)
		.then(function successCallback(data) {
			console.log(data);
			console.log("hide progressbar");
			if(callback){	
				callback(data);
				//console.log(" in call back hide progressbar");
			}
		
		})
		.catch( function errorCallback(data) {
			//console.log("Error");
		})
		.finally(function(){
		//	console.log('Finally block');
			utils.hideProgressBar();
		});
	};
	
	this.deleteItem = function(urlPath, callback){
		utils.showProgressBar();
		var httpparams = this.getHTTPParams('DELETE',urlPath);
		$http(httpparams).then(function successCallback(data) {
			if(callback){
				callback(data);
			}
		}).catch( function errorCallback(data) {
			//console.log("Error");
		})
		.finally(function(){
			//console.log('Finally block');
			utils.hideProgressBar();
		});
	};
	
	this.updateItem = function(urlPath, callback, data){
		utils.showProgressBar();
		var httpparams = this.getHTTPParams( 'PUT', urlPath, data);
		$http(httpparams).then(function successCallback(data) {
			if(callback){
				callback(data);
			}
		}).catch( function errorCallback(data) {
			//console.log("Error");
		})
		.finally(function(){
			//console.log('Finally block');
			utils.hideProgressBar();
		});
	};
	
	this.createItem = function(urlPath, callback, data){
		utils.showProgressBar();
		var httpparams = this.getHTTPParams( 'POST', urlPath, data);
		$http(httpparams).then(function successCallback(data) {
			if(callback){
				callback(data);
			}
		}).catch( function errorCallback(data) {
			console.log("Error");
		})
		.finally(function(){
			console.log('Finally block');
			utils.hideProgressBar();
		});
	};
	
	
});