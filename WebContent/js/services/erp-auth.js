erpApp.factory('Auth', function(){
	var user;

	return{
	    setUser : function(aUser){
	    	if(sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}else{
	    		user = {};
	    	}
	        user = aUser;
        	sessionStorage.user =JSON.stringify(user);
	    },
	    setMenu : function(menu){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	user.menu = menu;
	    	sessionStorage.user =JSON.stringify(user);
	    },
	    setReport : function(reports){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	user.reports = reports;
	    	sessionStorage.user =JSON.stringify(user);
	    },
	    
	    isLoggedIn : function(){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	        return (user)? true : false;
	    },
	    getAuthToken : function(){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	        return user.auth_token;
	    },
	    setAuthToken : function(aUser){
	    	if(sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}else{
	    		user = {};
	    	}
	        user.auth_token = aUser.auth_token;
        	sessionStorage.user =JSON.stringify(user);
	    },
	    getMenu : function(){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	return user.menu;
	    },
	    getReport : function(){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	return user.reports;
	    },
	    setUserName : function()
	    {
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	user.user.userid=userid;
	    	sessionStorage.user =JSON.stringify(user);
	    },
	    
	    getUserName : function()
	    {
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	/*return user.userId;*/
	    	return user.user;
	    	
	    },
	    isPageAccessible : function(next){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	var index = 0;
	    	var isPageAccessible = false;
	    	for(index = 0; index<user.menu.length;index++){
	    		if(user.menu[index].url == next.$$route.originalPath){
	    			isPageAccessible = true;
	    		}
	    	}
	    	return isPageAccessible;
	    },
	    logout : function(){
	    	sessionStorage.removeItem("user");
	    	user = undefined;
	    	
	    }
	  }
	});