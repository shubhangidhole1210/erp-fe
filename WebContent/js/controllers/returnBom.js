/*erpApp.controller('returnBomCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils){
	  $scope.showReturnBom = function(ev) {
		  $scope.bomInformation="DOWNLOAD BOM"
		    $mdDialog.show({
		      controller: 'bomReturnDialogueController',
		      templateUrl: 'views/bomReturnDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen,
		      locals : {
					
		    	  bomInformation : $scope.bomInformation
				}
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
		  };
});*/

erpApp.controller('returnBomCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils) {
	
	  $scope.showReturnBom = function(ev) {
		  $scope.bomInformation="DOWNLOAD BOM"
		    $mdDialog.show({
		      controller: 'bomReturnDialogueController',
		      templateUrl: 'views/bomReturnDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen,
		      locals : {
					
		    	  bomInformation : $scope.bomInformation
				}
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
		  };
	
	
	
	
	

	
	function ProgressBarController($scope, $mdDialog) {
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	}

});