erpApp.controller('rmOrderDialogCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,flag,$filter,action,dialogueTitle,rmOrder,utils,hideAction,priceAction,vendorAction,nameAction,erpWSService,uiAction,requiredListAction,saveButtonAction){
	
	$scope.isReadOnly = action;
	$scope.isName = nameAction;
	$scope.flag = flag;
	$scope.rmOrder = rmOrder;
	$scope.isPriceReadOnly = priceAction;
	$scope.isVendorId = vendorAction;
	$scope.rmOrder.actualPrice = $scope.rmOrder.actualPrice ? $scope.rmOrder.actualPrice : 0;
	$scope.rmOrder.tax = $scope.rmOrder.tax ? $scope.rmOrder.tax : 0;
	$scope.rmOrder.totalPrice = $scope.rmOrder.totalPrice ? $scope.rmOrder.totalPrice : 0;
	$scope.rmOrder.otherCharges = $scope.rmOrder.otherCharges ? $scope.rmOrder.otherCharges : 0;
	$scope.dialogueTitle = dialogueTitle;
	$scope.displayAddRM = hideAction;
	$scope.rmMsg = true;
	$scope.rmOrder.expectedDeliveryDate = new Date($scope.rmOrder.expectedDeliveryDate);
	$scope.rmOrder.createDate = new Date($scope.rmOrder.createDate);
	$scope.orderRawMaterials=[];
	$scope.orderRawMaterial={};
	$scope.otherCharges=0;
	var TAX = 0.18;
	$scope.isRMOrder = uiAction;
	$scope.isRequiredList = requiredListAction;
	$scope.isSaveButtonHide = saveButtonAction;
	
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		console.log('rm order dialog cancel method : ', $mdDialog);
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
	
	$scope.onItemCreated = function(response){
		$scope.onResponseReceived(response); 
	};
	
	$scope.onItemUpdated = function(response){
		$scope.onResponseReceived(response);
	};
	
	$scope.onResponseReceived = function(response){
		if(response.data.code === 0){
			console.log(response.data.message);
			utils.showToast(response.data.message)
		}else{
			utils.showToast(response.data.message);
			$rootScope.$emit("CallPopulateRMOrderList",{});
			$scope.hide();
		}
	};
	
	
	$scope.saveRMOrder = function(ev) {
		if ($scope.flag == 0) {
			var index=0;
			var rmOrderList=[];
			for(index = 0;index < $scope.requiredRMList.length; index++){
				var rmOrder={}
				rmOrder.vendorId = $scope.requiredRMList[index].vendor.id;
				rmOrder.expectedDeliveryDate =$scope.requiredRMList[index].expectedDeliveryDate;
				 var rmList=[];
				 var rm={};
				 rm.quantity = $scope.requiredRMList[index].quantity;
				 rm.rawmaterialId =$scope.requiredRMList[index].rmId;
				 rmList.push(rm); 
				 rmOrder.rmOrderAssociationDTOs = rmList;
				 rmOrderList.push(rmOrder);
			}
			
			var data = {
					rawmaterialOrderDTOs : rmOrderList
			};
			erpWSService.createItem("rawmaterialorder/createMultipleRMOrder", $scope.onItemCreated, data);
		} else {
			var data = {
					rmOrderAssociationDTOs:$scope.orderRawMaterials,
					name :$scope.rmOrder.name,
					description:$scope.rmOrder.description,
					quantity:$scope.rmOrder.quantity,
					vendorId:$scope.rmOrder.vendorId.id,
					otherCharges:$scope.rmOrder.otherCharges,
					expectedDeliveryDate:$scope.rmOrder.expectedDeliveryDate,
					createDate:$scope.rmOrder.createDate
			};
			data.id = $scope.rmOrder.id;
			erpWSService.updateItem("rawmaterialorder/update", $scope.onItemUpdated, data);
		}
	};
	
	$scope.validateCreateDate = function(createDate){
		console.log("createDate:",createDate);
		$scope.currentDate = new Date();
		if(createDate === $scope.currentDate){
		}else{}
	};
	
	/* $scope.expectedDateValidation = function(expectedDeliveryDate,$index){
		  $scope.currentDate = new Date();
		  if(expectedDeliveryDate <= $scope.currentDate){
			  $scope.msg="Date should be greater then current date";
			  $scope.RMOrderInformation["expecteddeliveryDate" + $index].$setValidity("customMsg", false);
		  }else{
			     $scope.RMOrderInformation["expecteddeliveryDate" + $index].$setValidity("customMsg", true);
		  }
	  };*/
	
	$scope.submitRMOrderInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveRMOrder();
		} else {
			utils.showToast('Please fill all required information');
			//$scope.validateIsMultipleRMAdded();
		}
		//$scope.validateIsMultipleRMAdded();
		
	};
	
	$scope.validateIsMultipleRMAdded = function(){
		if($scope.orderRawMaterials.length >= 1){
			console.log("if")
			utils.showToast("Please add atleast one raw material");
			$rootScope.$emit( "saveRMOrderError", {});
		}else{
			console.log("else");
		}
	};
	
	$scope.onRMByVendoeListrecived = function(response){
		$scope.vendorRmList = response.data.data;
	};
	
	$scope.getRMListByVendor = function(){
		 erpWSService.getList("rawmaterial/getRMaterial/" + $scope.rmOrder.vendorId.id , $scope.onRMByVendoeListrecived);
		 $scope.clearAddedRmList();
	};
	
	$scope.calculateTotalPrice=function(){
		$scope.productSubTotal = 0;
		for (var i = 0; i < $scope.orderRawMaterials.length; i++){
		   $scope.productSubTotal += $scope.orderRawMaterials[i].rawmaterialId.pricePerUnit * $scope.orderRawMaterials[i].quantity;
		}
		$scope.rmOrder.actualPrice = $scope.productSubTotal;
		$scope.rmOrder.tax = $scope.productSubTotal * TAX;
		$scope.rmOrder.totalPrice = $scope.rmOrder.actualPrice + $scope.rmOrder.tax + $scope.rmOrder.otherCharges;
	};
	
	$scope.updateOtherCharges=function(){
		$scope.rmOrder.totalPrice = $scope.rmOrder.actualPrice + $scope.rmOrder.tax + $scope.rmOrder.otherCharges;
	};
	
	$scope.updateQuantity = function(quantity){
		if(quantity < 0){
			$scope.RMOrderInformation.quantity.$setValidity("quantityUpdateMessage" , false);
		}else{
			$scope.RMOrderInformation.quantity.$setValidity("quantityUpdateMessage" , true);
			$scope.calculateTotalPrice();
		}
	};
	
	$scope.onVendorListRecived = function(response){
		$scope.vendorData = response.data.data;
	};
	
	$scope.displayVendorId=function(){
		 erpWSService.getList("vendor/list", $scope.onVendorListRecived);
	};
	
	    $scope.addOrderRawMaterial = function(){
	    	if( !angular.equals($scope.orderRawMaterial,{}) ){
	    		if(!$scope.isDuplicateRM($scope.orderRawMaterial)){
				   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
				   $scope.RMOrderInformation.rawmaterial.$setValidity("message", true);
				   $scope.orderRawMaterial={};
				   $scope.message="";
	    		}else{
	    			$scope.message = 'This Rawmaterial is already added';
					$scope.RMOrderInformation.rawmaterial.$setValidity("message", false);
	    		}
			}
	    	$scope.calculateTotalPrice();
	    	console.log("after adding data $scope.orderRawMaterials :", $scope.orderRawMaterials);
	    };
	    
	    $scope.onChangeRM = function(){
	    	$scope.RMOrderInformation.rawmaterial.$setValidity("message", true);
	    };
	
	    $scope.isDuplicateRM = function(orderRawMaterial) {
			for (var i = 0; i < $scope.orderRawMaterials.length; i++) {
				if ($scope.orderRawMaterials[i].rawmaterialId.id === orderRawMaterial.rawmaterialId.id) {
					return true;
				}
			}
			return false;
		};
		
	    $scope.deleteRM=function(index) {
	    	var lastItem = $scope.orderRawMaterials.length;
		    $scope.orderRawMaterials.splice(index,1);
		    $scope.calculateTotalPrice();
		    $scope.setActualPrice();
	    };
	    
	    $scope.onRmOrderassociationListRecived = function(response){
	    	$scope.rmOrderList = response.data.data;
	    };
	    
	    $scope.getRmForOrder = function(){
	    	erpWSService.getList("rawmaterialorderassociation/getRMForRMOrder/"+ $scope.rmOrder.id , $scope.onRmOrderassociationListRecived);
	    };
	   
	    $scope.addMultipleVendor = function(rawMaterial){
	    
	    	 $scope.requiredRMList.push(angular.copy(rawMaterial));
	    	 console.log(" $scope.requiredRMList:", $scope.requiredRMList)
	    }
	    
	    $scope.setActualPrice = function(){
	    	if( $scope.orderRawMaterials.length === 0 ){
	    		$scope.rmOrder.otherCharges=0;
	    		$scope.rmOrder.totalprice=0;
	    	}
	    };
	    
	    $scope.clearAddedRmList = function(){
	    	$scope.orderRawMaterials.length =0;
	    };
	    
	    $scope.getRequiredRawMaterials = function(){
	    	erpWSService.getList('rawmaterialorder/getRequiredRMList',$scope.onRequiredRMListReceived);
	    };
	    
	    $scope.onRequiredRMListReceived = function(response){
	    	$scope.requiredRMList = response.data.data;
	    	console.log("$scope.requiredRMList:",$scope.requiredRMList);
	    
	    };
	    
	    $scope.onRMVendorAssociationListRecived = function(response){
	    	$scope.requiredRMList[index].vendorList = response.data.data;
	    	console.log("$scope.requiredRMList[index].vendorList:",$scope.requiredRMList[index].vendorList);
	    };
	    
	    $scope.getVenodrList = function(index,id) {
	    	erpWSService.getList('rmvendorasso/rmVendorList/'+id,$scope.onRMVendorAssociationListRecived);
	    };
});