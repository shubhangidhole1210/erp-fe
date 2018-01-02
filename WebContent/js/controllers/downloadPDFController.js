erpApp.controller('downloadPDFController',function($scope, $mdDialog, $location,$rootScope,SERVER_URL,Auth,$http,utils,erpWSService){
	
	$scope.ProductOrderMsg = true;
	$scope.isBomDisabled = true;
	$scope.generateBomMsg = false;
	
	$scope.onproductListRecived = function(response){
		$scope.products = response.data.data;
	};
	
	$scope.getProductListByGenerateBom = function(response){
		erpWSService.getList("bom/getProductList", $scope.onproductListRecived);
	};
	
	$scope.onBomListRecived = function(response){
		$scope.bomData = response.data.data;
         if($scope.bomData === ""){
        	 $scope.generateBomMsg = true;
        	 $scope.isBomDisabled = true;
         }else{
        	 $scope.generateBomMsg = false;
        	 $scope.isBomDisabled = false;
         }
	};
	
	$scope.getGenerateBom = function(){
		$scope.isBomDisabled = false;
        $scope.ProductOrderMsg = false;
		erpWSService.getList("bom/bomList/" + $scope.product.id, $scope.onBomListRecived);
	};
	
	$scope.submitPdfDownloadData = function(id,bom){
		if(id == null && bom == null){
			  utils.showToast("please select Product and BOM");
		   }else if(id == null){
			utils.showToast("please select product ID");
		}else if(bom == null){
			utils.showToast("please select BOM ID");
		}else{
			utils.showToast("PDF download sucessfully");
			$scope.downloadPdf();
		}
	};
	
	$scope.downloadPdf = function () {
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/downloadBomPdf/" + $scope.product.id + "/" +$scope.bom.id;
		httpparams.responseType = 'arraybuffer';
		httpparams.headers = {
			      auth_token : Auth.getAuthToken()
		        };
		$http(httpparams).then( function successCallback(response,data, status, headers){
			console.log(response.headers);
	        headers = response.headers();
	        var filename = headers['BOMDetails.pdf'];
	        var contentType = headers['content-type'];
	        console.log("file name:-" + filename);
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
		utils.showConfirm();
	};
	
	$scope.cancelBOMPage = function(){
		$location.path('/');
	};
	
});