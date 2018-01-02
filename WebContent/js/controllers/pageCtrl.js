erpApp.controller('pageCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,erpWSService,$location, $anchorScroll, $filter) {
  
       var FLAG_ADD  = 0,
		FLAG_EDIT = 1,
		FLAG_VIEW = 2;
     
       $scope.topDirections = ['left', 'up'];
       $scope.bottomDirections = ['down', 'right'];
 	
 	   $scope.isPagePresent=false;
       $scope.page={};
       $scope.isSaveButtonHide = false;

 	   $scope.isOpen = false;

	   $scope.availableModes = ['md-fling', 'md-scale'];
	   $scope.selectedMode = 'md-scale';

 	   $scope.availableDirections = ['up', 'down', 'left', 'right'];
 	   $scope.selectedDirection = 'right';
     
	   $rootScope.$on("CallPopulatePageList", function() {
		$scope.populatePageList();
	    });
	   
	   $scope.currentPage = 0;
	     $scope.pageSize = 15;
	     $scope.data=[];
	
		$scope.onListReceived = function(response){
			$scope.data = response.data.data;
			$scope.pages=response.data.data;
		     if($scope.pages.length < 16){
		    	 $scope.isPaginationBtnHide = false;
		     }else{
		    	 $scope.isPaginationBtnHide = true;
		     }
		};
	
		$scope.populatePageList = function() {
		     erpWSService.getList("page/list", $scope.onListReceived);
		};
	
		$scope.addNewPage = function(ev) {
			$scope.showDialog(ev, { page : {},
				flag : FLAG_ADD,
				action : false,
				dialogueTitle : "Add New Page",
				saveButtonAction : true
			});
		};
		
		$scope.toFindPage = function(page){
			
		}
		
		$scope.totalNoOfPages = function(){
			 var myFilteredData = $filter('filter')($scope.pages,$scope.searchText);
			 return Math.ceil(myFilteredData.length/$scope.pageSize);
			 for (var i=0; i<pages.length; i++) {
			        $scope.pages.push("Item "+i);
			    }
		}
	
		$scope.onItemDeleted = function(response){
			if(response.data.code === 0){
				utils.showToast('Something went worng. Please try again later.')
	
			}else{
				$scope.displayProgressBar = false;
				$rootScope.$emit("CallPopulatePageList", {});
				utils.showToast("Page deleted sucessfully");
			}
		};
	
		$scope.editPageInformation = function(ev, $index) {
			$scope.showDialog(ev, { page : $scope.pages[($scope.currentPage*$scope.pageSize) + ($index)],
				flag : FLAG_EDIT,
				action : false,
				dialogueTitle : "Edit Page Information",
				saveButtonAction : true
			});
		};
	
		$scope.viewPageInformation = function(ev, $index) {
			$scope.showDialog(ev, { page : $scope.pages[($scope.currentPage*$scope.pageSize) + ($index)],
									flag : FLAG_VIEW,
									action : true,
									dialogueTitle : "View User Type Information",
									saveButtonAction : false
			});
		};
	
		$scope.showDialog = function(ev, locals){
			$mdDialog.show({
				controller : 'pageDialogController',
				templateUrl : 'views/pageDialog.html',
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
		
		$scope.showConfirm = function(ev,$index) {
			var confirm =  $mdDialog.confirm()
									.title('Are you sure you want to Delete Page Information?')
									.ariaLabel('')
									.targetEvent(ev)
									.ok('Yes' )
									.cancel('No');

			$mdDialog.show(confirm)
					.then(function() {
						$scope.deletePage(($scope.currentPage*$scope.pageSize) + ($index));
					}, function() {});
		};
	
		$scope.deletePage = function(index) {
			erpWSService.deleteItem("page/delete/" + $scope.pages[index].id , $scope.onItemDeleted);
		};
	
	
	$scope.gotoPrevPage = function(){
		 $location.hash('tableHead');
	        $anchorScroll();
		 $scope.currentPage = $scope.currentPage - 1;
	};
	
	$scope.gotoNextPage = function(){
		 $location.hash('tableHead');
	        $anchorScroll();
		 utils.scrollToTop();
		 $scope.currentPage = $scope.currentPage + 1;
	};
	
});
