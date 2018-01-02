erpApp.controller('forgetPassCtrl',function($scope,$location)
{
	$scope.backToLogin = function(){
		$location.path('/login');
	};
	
	});