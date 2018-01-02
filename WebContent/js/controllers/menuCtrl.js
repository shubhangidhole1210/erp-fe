erpApp.controller('menuController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location,$animate) {
	$scope.menu = [];
	$scope.displayMenu=Auth.isLoggedIn();
	
	$scope.createCascadedMenu = function(){
		var cascadedMenu = [];
		for (var index=0; index < $scope.menu.length ; index++){
			var cascadedMenuItem = {};
			var isMenuAdded = false;
			var indexAdded = 0;
			for (var subindex=0; subindex < cascadedMenu.length ; subindex++){
				if(cascadedMenu[subindex].menu === $scope.menu[index].menu ){
					var subMenu = {};
					subMenu.submenu = $scope.menu[index].submenu;
					subMenu.url = $scope.menu[index].url;
					cascadedMenu[subindex].submenu.push(subMenu);
					isMenuAdded = true;
					indexAdded = subindex+1;
					break;
				}
			}
			if(cascadedMenu.length == 0 || !isMenuAdded){
				cascadedMenuItem.menu = $scope.menu[index].menu;
				var subMenu = {};
				cascadedMenuItem.submenu = [];
				subMenu.submenu = $scope.menu[index].submenu;
				subMenu.url = $scope.menu[index].url;
				cascadedMenuItem.submenu.push(subMenu);
				cascadedMenu.push(cascadedMenuItem);
			}
		}
		return cascadedMenu;
	};
	
	if($scope.displayMenu){
		$scope.menu = Auth.getMenu();
		$scope.cascadedMenu = $scope.createCascadedMenu();
	}
	
	$rootScope.$on('logout',function($event){
		$scope.displayMenu=Auth.isLoggedIn();
	});
	
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside menuController login success event');
		$scope.displayMenu=Auth.isLoggedIn();
		$scope.menu = Auth.getMenu();
		$scope.cascadedMenu =  $scope.createCascadedMenu();
		$scope.user = Auth.getUserName();
	});
	$scope.selectedIndex = 0;
	$scope.menuClicked=function($index){
		console.log('index : ',$index);
		if($scope.selectedIndex !== $index)
			$scope.cascadedMenu[$scope.selectedIndex].displaySubmenu = false;
		$scope.selectedIndex = $index;
		$scope.cascadedMenu[$index].displaySubmenu = !$scope.cascadedMenu[$index].displaySubmenu;
		document.getElementById( 'menu' + $index).focus = true;
	};
	
	$scope.userId= '';
	if(Auth.isLoggedIn()){
		$scope.userId = Auth.getUserName();
		$scope.displayUserName = true;
		$scope.displayLogoutButton = true;
	}else{
		$scope.displayUserName = false;
		$scope.displayLogoutButton = false;
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayLogoutButton=Auth.isLoggedIn();
		$scope.displayUserName=Auth.isLoggedIn();
		$location.path('/login');
	});
	
	
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayUserName = Auth.isLoggedIn();
		$scope.displayLogoutButton = Auth.isLoggedIn();
		$scope.userId = Auth.getUserName();
	});	
	
	$scope.onClickHarmBurgerMenu = function($event){
		$scope.changeMainView();
		$event.preventDefault();
	    $scope.closed=!$scope.closed;
	    console.log("in onclick function")
	}
	
	$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
	$rootScope.$on('logout', function($event){
		$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
	});
	$rootScope.$on('loginSuccess', function($event){
		$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
	});
	
	/*$scope.mainClass = "main-class";*/
	$scope.changeMainView = function(){
		if($scope.mainClass === "main-class"){
			$scope.mainClass = "change-main-class";
		}else{
			$scope.mainClass = "main-class";
		}
	};
	
});
