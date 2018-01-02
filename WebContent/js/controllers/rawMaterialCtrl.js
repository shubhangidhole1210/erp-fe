erpApp.controller('rawMaterialCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,erpWSService,$filter) {
	
	
	$scope.isRmPresent=false;
	$scope.isUnitReadOnly = false;
	$scope.rawMaterial = {};
	$scope.isImagePopUp = false;
	$scope.isRMImagePresent=false
	$scope.currentPage = 0;
    $scope.pageSize = 15;
	
	var FLAG_ADD  = 0,
	FLAG_EDIT = 1,
	FLAG_VIEW = 2;
	
	
	
	$rootScope.$on("populateRawMaterialList", function() {
		$scope.populateRawMaterials();
	});
	
	$scope.topDirections = ['left', 'up'];
	$scope.bottomDirections = ['down', 'right'];

	$scope.isOpen = false;

	$scope.availableModes = ['md-fling', 'md-scale'];
	$scope.selectedMode = 'md-scale';

	$scope.availableDirections = ['up', 'down', 'left', 'right'];
	$scope.selectedDirection = 'right';
	
	$scope.onListReceived = function(response){
		$scope.rawMaterialList = response.data.data;
		$scope.getRawMaterialInformation();
		console.log("$scope.rawMaterialList :",$scope.rawMaterialList);
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
	     if($scope.rawMaterialList.length < 16){
	    	 $scope.isPaginationBtnHide = false;
	     }else{
	    	 $scope.isPaginationBtnHide = true;
	     }
	};
	
	/*$scope.totalNoOfPages = function(){
		 var myFilteredData = $filter('filter')($scope.rawMaterialList,$scope.searchtext);
		 return Math.ceil(myFilteredData.length/$scope.pageSize);
		 for (var i=0; i<rawMaterialList.length; i++) {
		        $scope.rawMaterialList.push("Item "+i);
		    }
	}*/
	
	$scope.onItemDeleted = function(response){
		if(response.data.code === 0){
			utils.showToast('Something went worng. Please try again later.')

		}else{
			$scope.displayProgressBar = false;
			$rootScope.$emit("populateRawMaterialList", {});
			utils.showToast(response.data.message);
		}
	};
	
	$scope.populateRawMaterials=function(){
		 erpWSService.getList("rawmaterial/list", $scope.onListReceived);
	}
	
/*	$scope.criteria={
		    searchtext:'',
		    page: 1,
		    pagesize: 15,
		    sort: 'Name',
		  };
		  $scope.paging ={
		    total : 0,
		    totalpages: 0,
		    showing: 1,
		    pagearray: [],
		  };*/
	
	/* $scope.populateRawMaterials=function(){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rawmaterial/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		 $http(httpparams).then(function successCallback(response) {
				$scope.rawMaterialList = response.data.data;
				console.log(response);
				$scope.paging.total = $scope.rawMaterialList.length;    
			      var a = ($scope.criteria.page - 1) * $scope.criteria.pagesize;
			  var b = $scope.criteria.page  * $scope.criteria.pagesize;
			    
			     $scope.rawMaterialList = $scope.rawMaterialList.slice( a, b );   
				
			//	$scope.paging.total = $scope.rawMaterialList.length;
			     paging1($scope.criteria.page, $scope.criteria.pagesize, 
			             $scope.paging.total);
			}, function errorCallback(response) {
				console.log("Error");
			});
	    };*/
	    
	   /* function paging1(current, pagesize, total){
	        var totalpages = Math.ceil(total/pagesize);
	        $scope.paging.totalpages = totalpages;
	        // clear it before playing
	        $scope.paging.pagearray = [];
	        if(totalpages <=1) return;
	        
	        
	        if(totalpages <= 5){
	          for(var i =1; i<= totalpages; i++)
	              $scope.paging.pagearray.push(i);
	        }
	        
	        if(totalpages > 5){
	          if(current <=3){        
	            for(var i =1; i<= 5; i++)
	              $scope.paging.pagearray.push(i);
	            
	            $scope.paging.pagearray.push('...');
	            $scope.paging.pagearray.push(totalpages);
	            $scope.paging.pagearray.push('Next');
	          }
	          else if(totalpages - current <=3){
	            $scope.paging.pagearray.push('Prev');
	            $scope.paging.pagearray.push(1);
	            $scope.paging.pagearray.push('..');
	            for(var i =totalpages - 4; i<= totalpages; i++)
	              $scope.paging.pagearray.push(i);
	          }
	          else {
	            $scope.paging.pagearray.push('Prev');
	            $scope.paging.pagearray.push(1);
	            $scope.paging.pagearray.push('..');  
	            
	            for(var i = current - 2; i<= current + 2; i++)
	              $scope.paging.pagearray.push(i);
	              
	            $scope.paging.pagearray.push('...');
	            $scope.paging.pagearray.push(totalpages);
	            $scope.paging.pagearray.push('Next');
	            }        
	        }      
	      }  */
	   
	    $scope.isNextButtonDisabled = false;
	    $scope.gotoPrevPage = function(){
			 if($scope.criteria.page >= 1)      
			      $scope.criteria.page--;
		};
		  
		$scope.gotoNextPage = function(){
			 if($scope.criteria.page < $scope.paging.totalpages)  {
				 $scope.criteria.page++;
			 }    
		};
	    
	    
	$scope.getRawMaterialInformation = function() {
		$scope.isRmPresent = $scope.rawMaterialList.length === 0 ? true : false;
	};
	
	$scope.addRawMaterial = function(ev) {
		
		$scope.showDialog(ev, { rawMaterial : {},
			flag : FLAG_ADD,
			action : false,
			unitAction : false,
			information : "Add New Raw Material",
			saveButtonaction : true
		});
	};
	
	$scope.editRMInformation = function(ev, $index) {
		$scope.showDialog(ev, { rawMaterial : $scope.rawMaterialList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_EDIT,
			action : false,
			unitAction : true,
			information : "Edit Raw Material",
			saveButtonaction : true
		});
		console.log("$scope.rawMaterialList[($scope.currentPage*$scope.pageSize) + ($index):",$scope.rawMaterialList[($scope.currentPage*$scope.pageSize) + ($index)]);
	};
	
	$scope.viewRMInformation = function(ev, $index) {
		
		$scope.showDialog(ev, { rawMaterial : $scope.rawMaterialList[($scope.currentPage*$scope.pageSize) + ($index)],
			flag : FLAG_VIEW,
			action : true,
			unitAction : true,
			information : "View Raw Material",
			saveButtonaction : false
		});
		
	};
	
	$scope.showDialog = function(ev, locals){
		$mdDialog.show({
			controller : 'rawMaterialDialogCtrl',
			templateUrl : 'views/rawMaterialDialog.html',
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
	
	
	$scope.deleteraeMaterial = function(index) {
		erpWSService.deleteItem("rawmaterial/delete/" + $scope.rawMaterialList[index].id , $scope.onItemDeleted);
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm =  $mdDialog.confirm()
								.title('Are you sure you want to Delete Raw Material Information?')
								.ariaLabel('')
								.targetEvent(ev)
								.ok('Yes' )
								.cancel('No');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteraeMaterial(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
	};
	
	/*$scope.getImage = function($index){
		$scope.isImagePopUp = true;
		console.log("get image");
		console.log("$scope.rawMaterialList:",$scope.rawMaterialList);
		 var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL
					+ "rawmaterial/image/"
					+ $scope.rawMaterialList[($scope.currentPage*$scope.pageSize) + ($index)].id;
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(
					function successCallback(response) {
						 $scope.imgData = response.data
						console.log(response);
						utils.hideProgressBar();
						$scope.dispalyImageMsg();
					}, function errorCallback(response) {
					});
	};*/
	
	$scope.dispalyImageMsg = function(){
		if( $scope.imgData === ""){
			$scope.isRMImagePresent= true;
		}else{
			$scope.isRMImagePresent= false;
		}
	};
	
	
	
	$scope.cancelGuideLinePopUp = function(){
		$scope.isImagePopUp = false;
	}
});
