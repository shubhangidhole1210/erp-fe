erpApp.controller('notificationDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,notification,action,flag,dialogueTitle,erpWSService,saveButtonAction) {
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.notification = notification;
	$scope.dialogueTitle = dialogueTitle;
	$scope.isSaveButtonHide = saveButtonAction
	
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
	
	$scope.saveNotificationInformation = function(ev) {
		var data = {
				beanClass :  $scope.notification.beanClass ,
				description: $scope.notification.description,
				name: $scope.notification.name,
				subject: $scope.notification.subject ,
				template: $scope.notification.template,
				type: $scope.notification.type,
				status1 : $scope.notification.status1,
		};
		if ($scope.flag == 0) {
			
			erpWSService.createItem("notification/create", $scope.onItemCreated, data);
		} else {
			data.id = $scope.notification.id;
			erpWSService.updateItem("notification/update", $scope.onItemUpdated, data);
		}
	};
	
	$scope.onStatusListRecived = function(response){
		$scope.status=response.data.data;
	};
	
	$scope.statusList=function(){
		 erpWSService.getList("status/list", $scope.onStatusListRecived);
	};
	
	$scope.submitnotificationForm = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveNotificationInformation($event);
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
});