erpApp.controller('notificationUserAssociationDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,notificationUser,action,flag,dialogueTitle,erpWSService,saveButtonAction) {
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.sendOption = '';
	$scope.notificationUser = notificationUser;
	$scope.dialogueTitle = dialogueTitle;
	$scope.notificationUser.to = false;
	$scope.notificationUser.cc = false;
	$scope.notificationUser.bcc = false;
	$scope.isRdaioButtinVisible = false;
	$scope.rdaioButtinVisibleForTo = false;
	$scope.rdaioButtinVisibleForCc = false;
	$scope.rdaioButtinVisibleForBcc = false;
	$scope.isSaveButtonHide = saveButtonAction;
	
	$scope.hide = function() {
		console.log('hide DialogController');
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		console.log('$mdDialog',$mdDialog);
		$mdDialog.hide(answer);
	};
	
	$scope.onNotificationListRecived= function(response){
		$scope.notificationList=response.data.data;
	};
	
	$scope.getNotificationInformation=function(){
		 erpWSService.getList("notification/list", $scope.onNotificationListRecived);
	};
	
	$scope.onNotificationListRecived = function(response){
		$scope.notificationList=response.data.data;
	};
	
	$scope.getNotificationInformation=function(){
		erpWSService.getList("notification/list",$scope.onNotificationListRecived);
	};
	
	$scope.onSendOptionChanged = function(){
		console.log("sendOption :" , $scope.sendOption);
		if($scope.sendOption === "to"){
			$scope.notificationUser.to = true;
			$scope.notificationUser.cc = false;
			$scope.notificationUser.bcc = false;
			$scope.rdaioButtinVisibleForCc = true;
			$scope.rdaioButtinVisibleForBcc = true;
		}else if($scope.sendOption === "cc"){
			$scope.notificationUser.cc = true;
			$scope.notificationUser.to = false;
			$scope.notificationUser.bcc = false;
			$scope.rdaioButtinVisibleForTo = true;
			$scope.rdaioButtinVisibleForCc = false;
			$scope.rdaioButtinVisibleForBcc = true;

		}else{
			$scope.notificationUser.bcc = true;
			$scope.notificationUser.to = false;
			$scope.notificationUser.cc = false;
			$scope.rdaioButtinVisibleForTo = true;
			$scope.rdaioButtinVisibleForCc = true;
			$scope.rdaioButtinVisibleForBcc = false;
		}
	};
	
	$scope.onUserListRecived = function(response){
		$scope.userList=response.data.data;
	};
	
	$scope.getUserInformation=function(){
		 erpWSService.getList("user/list", $scope.onUserListRecived);
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
			$rootScope.$emit("CallPopulateNotificationList",{});
			$scope.hide();
		}
	};
	
	$scope.saveNotificationUserAssociationInformation = function(ev) {
		var data = {
				userId:$scope.notificationUser.userId.id,
				notificationId :$scope.notificationUser.notificationId.id,
				cc:$scope.notificationUser.cc,
				bcc:$scope.notificationUser.bcc,
				to:$scope.notificationUser.to
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("notificationuserassociation/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.notificationUser.id;
			erpWSService.updateItem("notificationuserassociation/update", $scope.onItemUpdated, data);
		}
	};

	$scope.submitNotificationUserAssociationForm = function(notificationId,userId) {
			/*$scope.saveNotificationUserAssociationInformation()*/
		console.log("notification id :" , notificationId);
		console.log("user id :" , userId);
		if(notificationId == null && userId == null){
			utils.showToast("Please Select Notification Id and User Id");
		}else if(notificationId == null){
			utils.showToast("Please select Notification id");
		}else if(userId == null){
			utils.showToast("Please select User id");
		}else{
			$scope.saveNotificationUserAssociationInformation();
		}
	};
});
