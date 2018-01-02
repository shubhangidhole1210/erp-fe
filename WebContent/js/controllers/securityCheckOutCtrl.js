erpApp.controller('securityCheckOutCtrl', function($scope, $http, $mdDialog, $mdToast,$rootScope, SERVER_URL,$filter,utils,Auth,$location,erpWSService) {
	 
	$scope.createDate = $filter('date')(Date.now(), 'MM-dd-yyyy');
	 $scope.productOrderMsg= true;
	 $scope.createDate = new Date($scope.createDate);
	 $scope.isProducyOrderDisable = true;
	 $scope.OrderCreationMsg = false;
	 $scope.intime = new Date();
	 
	 $scope.onClientListReceived = function(response){
		 $scope.clients = response.data.data;
		};
		
		$scope.getClientList=function(){
			 erpWSService.getList("client/list", $scope.onClientListReceived);
		};
		
		$scope.onListRecived = function(response){
			$scope.clientProductList = response.data.data;
			console.log("$scope.clientProductList:",$scope.clientProductList)
			if($scope.clientProductList.length === 0){
				console.log("if condition");
				$scope.OrderCreationMsg = true;
				 $scope.isProducyOrderDisable = true;
			}else{
				console.log("else block");
			 $scope.OrderCreationMsg = false;
				 $scope.isProducyOrderDisable = false;
			}
		};
		
		 $scope.productOrderListByClient=function(){
			 $scope.productOrderMsg= false;
	    	 $scope.isProducyOrderDisable = false;
			 erpWSService.getList("productorder/incompleteProductOrder/"+$scope.selectedClient, $scope.onListRecived);
			 $scope.clearProductList();
		 };
		
         $scope.clearProductList = function(){
        	 console.log("$scope.clientProductList:",$scope.clientProductList);
        	 console.log("$scope.productOtderList :",$scope.productOtderList);
        	 $scope.clientProductList.length=0;
        	 $scope.productOtderList.length=0;
		};
		
		 $scope.onProductListReceived = function(response){
			 $scope.productOtderList = response.data.data;
			};
			
			 $scope.getProductListByProductOrder = function(){
				 erpWSService.getList("productorder/productorderId/" +  $scope.productOrders.id, $scope.onProductListReceived);
			 };
	
			 $scope.onItemCreated = function(response){
					$scope.onResponseReceived(response); 
				};
			 
				$scope.onResponseReceived = function(response){
					if(response.data.code === 1){
						//$scope.hide();
						utils.showToast("Security Check out Sucessfully!");
				        $location.path('/');
					}else{
						$scope.displayProgressBar = false;
						utils.showToast(data.data.message);
					}
				};
				
				$scope.saveSecurityCheckOutInformation = function(ev) {
					console.log('Saving saveSecurityInformation');
					var index=0;
					var securityCheckOutParts = [];
					for(index=0;index<$scope.productOtderList.length;index++){
						var securityCheckOut = {};
						securityCheckOut.productId= $scope.productOtderList[index].productId.id;
						securityCheckOutParts.push(securityCheckOut);
					}
					console.log('intime : ' + $scope.intime.getTime());
					console.log('intime : ' + $scope.intime.toLocaleTimeString());
					
					var data = {
							invoiceNo : $scope.invoice_No,
							clientName : $scope.selectedClient,
							vehicleNo : $scope.vehicleNo,
							driverFirstName : $scope.firstName,
							driverLastName : $scope.lastName,
							description : $scope.description,
							createDate : $scope.createDate,
							inTime : $scope.intime.toLocaleTimeString().split(" ")[0],
							poNo :  $scope.productOrders.id,
							licenceNo : $scope.licence_no,
							securityCheckOutParts : securityCheckOutParts
					};
						erpWSService.createItem("securitycheckout/productOrderCheckOut", $scope.onItemCreated, data);
				};
			 
			 
	    $scope.submitInformation = function(isvaliduser, $event) {
			if (isvaliduser) {
				$scope.saveSecurityCheckOutInformation();
			} else{
				utils.showToast("Please field all required information");
			}
		};
		
		$scope.restInformation=function(){
			$location.path('/');
		};
		
		$scope.dateValidation = function(createDate){
			console.log("create date" + createDate);
			$scope.currentDate = new Date();
			console.log("currentDate" +$scope.currentDate);
			if(createDate != $scope.currentDate){
				console.log("if condition");
			}else{
				console.log("else condition");
			}
		};
});
