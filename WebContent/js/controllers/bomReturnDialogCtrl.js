/*erpApp.controller('returnBomCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,bomInformation){
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
	
	$scope.bomInformation=bomInformation;
	$scope.getProducts = function() {
		utils.showProgressBar();
		        var httpparams = {};
		         httpparams.method = 'GET';
		         httpparams.url = SERVER_URL + "bom/BomCompletedList";
		        httpparams.headers = {
				      auth_token : Auth.getAuthToken()
			        };
		
					$http(httpparams).then( function successCallback(response) {
								$scope.data = response.data;
								$scope.products = response.data.data;
								console.log(response);
								utils.hideProgressBar();
							},
							function errorCallback(response) {
								console.log("Error");
								utils.showToast('We are Sorry. Something went wrong. Please try again later.');
								utils.hideProgressBar();
			});
	};
	
	$scope.getBomInformation = function(){
		console.log($scope.rawMaterials);
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/bomList/" + $scope.product.product.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.bomData = response.data;
			console.log(response);
             utils.hideProgressBar();
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		});
		utils.showProgressBar();
	};
	
	$scope.downloadPdf = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.getPdf();
		} else {
			console.log('its else block');
			utils.showToast('Please select Product ID and BOM ID');
		}
	};
	
	$scope.getPdf = function () {
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/downloadBomPdf/" +$scope.product.product.id + "/" +$scope.bom.id;
		httpparams.responseType = 'arraybuffer';
		httpparams.headers = {
			      auth_token : Auth.getAuthToken()
		        };
		$http(httpparams).then( function successCallback(response,data, status, headers){
			console.log(response.headers);
	        headers = response.headers();
	        var filename = headers['BOMDetails.pdf'];
	        var contentType = headers['content-type'];
	        console.log("file name:-" + filename)
	        var linkElement = document.createElement('a');
	        console.log("bom id is :" ,$scope.bom.bomId)
	        try {
	            var blob = new Blob([response.data], { type: contentType });
	            var url = window.URL.createObjectURL(blob);
	            linkElement.setAttribute('href', url);
	            linkElement.setAttribute("download", $scope.bom.bomId);
	            var clickEvent = new MouseEvent("click", {
	                "view": window,
	                "bubbles": true,
	                "cancelable": false
	            });
	            linkElement.dispatchEvent(clickEvent);
	        } catch (ex) {
	            console.log(ex);
	        }
		},   
		function errorCallback(response) {
			console.log("Error");
			utils.showToast('We are Sorry. Something went wrong. Please try again later.');
			utils.hideProgressBar();
	    });
	};
});*/