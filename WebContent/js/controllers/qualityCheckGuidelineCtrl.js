erpApp.controller('qualityChcekGuidelineCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService)
{
	$scope.QualityCheckGuideline={};
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$rootScope.$on("CallPopulateGuideLineList", function() {
		$scope.populateGuideLineList();
	});
	
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("CallPopulateUnitList",{});
			utils.showToast(response.data.message);
		}
	};
	
	$scope.onGuideLineListRecived = function(response){
		$scope.QualityCheckGuideline=response.data.data;
		console.log("$scope.QualityCheckGuidelineList :" ,$scope.QualityCheckGuideline);
	};
	
	$scope.populateGuideLineList=function(){
		  erpWSService.getList("qcGuideline/list", $scope.onGuideLineListRecived);
	}
	
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'qualityCheckGuidelineDialogCtrl',
			templateUrl : 'views/qualityCheckGuidelineDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			fullscreen : $scope.customFullscreen,
			locals : locals
		})
		.then(
				function(answer) {},
				function() {});
	};
	
	$scope.addGuideLine = function(ev) {
		$scope.showDialog(ev, { QualityCheckGuideline : {},
			flag : FLAG_ADD,
			action : false,
			information : "Add New Guide Line "
		});
	};

	
	$scope.editGuideLineInformation = function(ev, $index) {
		$scope.showDialog(ev, { QualityCheckGuideline : $scope.QualityCheckGuideline[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			information : "Edit Guide Line Information"
		});
	};
	
	$scope.viewGuideLineInformation = function(ev, $index) {
		$scope.showDialog(ev, { QualityCheckGuideline : $scope.QualityCheckGuideline[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : true,
			information : "View Guide Line Information"
		});
	};
	
	$scope.deleteGuideLine = function(index) {
		erpWSService.deleteItem("qcGuideline/delete/" + $scope.QualityCheckGuideline[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Unit Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteGuideLine(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
	/*$scope.deleteGuideLine = function(index) {
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "qcGuideline/delete/" + $scope.QualityCheckGuidelineList[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			utils.showToast('GuideLine Deleted Sucessfully!');
			$rootScope.$emit("CallPopulateGuideLineList", {});

		}, function errorCallback(data) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			
		});
		utils.showProgressBar();
	};
	$scope.showConfirm = function(ev,$index) {
		var confirm = $mdDialog.confirm().title('Are you sure you want to Delete Guide Line Information?')
				.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteGuideLine(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};*/
	
	$scope.gotoPrevPage = function(){
		 utils.scrollToTop();
		 $scope.currentPage = $scope.currentPage - 1;
	};
	
	$scope.gotoNextPage = function(){
		 utils.scrollToTop();
		 $scope.currentPage = $scope.currentPage + 1;
	};
	
});