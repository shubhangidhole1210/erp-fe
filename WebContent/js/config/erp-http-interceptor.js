erpApp.config(function ($provide, $httpProvider) {
	  
	  // Intercept http calls.
	  $provide.factory('erpHttpInterceptor', function ($q,SERVER_URL,Auth,$location,$rootScope) {
	    return {
	      // On request success
	      request: function (config) {
	        // console.log(config); // Contains the data about the request before it is sent.

	        // Return the config or wrap it in a promise if blank.
	        return config || $q.when(config);
	      },

	      // On request failure
	      requestError: function (rejection) {
	        // console.log(rejection); // Contains the data about the error on the request.
	        
	        // Return the promise rejection.
	        return $q.reject(rejection);
	      },

	      // On response success
	      response: function (response) {
	        // console.log(response); // Contains the data from the response.
	        
	        // Return the response or promise.
	    	  if(response.config && response.config.url.includes(SERVER_URL)){
	    		  if(response.config.headers){
	    			  var header = response.headers('auth_token');
	    			  var userInfo = {};
	    			  userInfo.auth_token = header;
	    			  if(Auth){
	    				  Auth.setAuthToken(userInfo);
	    			  }
	    		  }
	    	  }
	        return response || $q.when(response);
	      },

	      // On response failture
	      responseError: function (rejection) {
	    	  console.log("Error : ", rejection); // Contains the data about the error.
	    	  if(rejection.config && rejection.config.url.includes(SERVER_URL)){
		    	  if(rejection.status === 403){
		    		  Auth.logout();
			    	  $rootScope.$emit("logout",{});
//		    		  $location.path = "/login";
		    	  }else{
		    		//  console.log("session expire");
		    	  }
		    	  
	    	  }
	    	  // Return the promise rejection.
	    	  return $q.reject(rejection);
	      }
	    };
	  });

	  // Add the interceptor to the $httpProvider.
	  $httpProvider.interceptors.push('erpHttpInterceptor');

	});