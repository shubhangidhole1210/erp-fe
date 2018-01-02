erpApp.controller('ToastCtrl', function($scope, $mdToast, message) {
	$scope.message = message;
	$scope.closeToast = function() {
		$mdToast.hide().then(function() {

		});
	};
});