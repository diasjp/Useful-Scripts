
/*
- https://www.servicenow.com/community/developer-articles/restrict-an-endpoint-from-basic-authentication/ta-p/2325659

1. Create Property - "restricted.basic-auth.endpoints", type = string , Value: comma separated list of endpoints you want to restrict from Basic Authentication.
2. Modify the OOB Script include named BasicAuth

Below is Script for the script include 
- [Added a function named isrestricted and this function will be called in another function named getAuthorized to check if the endpoint in the request is restricted for Basic Authentication or not]

*/


var BasicAuth = Class.create();

BasicAuth.prototype = {
	initialize : function(request, response, auth_type, auth_value) {
		this.request = request;
		this.response = response;
		this.auth_type = auth_type;
		this.auth_value = auth_value;
	},
	
	getAuthorized : function() {
		/* Mechanism to restrict certain endpoints from Basic Authentication */
		var checkIfRestricted = this.isrestricted();
		if(checkIfRestricted)
			{
			return null;
		}
		
		var up = GlideStringUtil.base64Decode(this.auth_value);
		var split = up.indexOf(":");
		
		if (split == -1) {
			gs.log("Basic authentication not well formed");
			return null;
		}
		
		// locate user and impersonate
		var userName = up.substring(0, split);
		var password = up.substring(split + 1);
		var result = GlideUser.authenticateUser(userName, password);
		
		if (!result) {
			gs.log("Basic authentication failed for user: " + userName);
			return null;
		}
		
		// user is authenticated, so return it...
		return result;
	},
	
	isrestricted : function(){
		var endpointsString = gs.getProperty("restricted.basic-auth.endpoints");
		var endpointsArray = endpointsString.split(",");
		var incomingRequestURL = this.request.getRequestURI()+'';
		if(endpointsArray.indexOf(incomingRequestURL) > -1)
			return true;
		else
			return false;
	}
}
