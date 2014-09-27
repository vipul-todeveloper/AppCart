myApp.service('adminServices', function($http){
    this.addAdmin = function(method, url, data){

        return $http({
            method: method,
            url:url,
            data: JSON.stringify(data)
        })
    }

    this.loginAdmin = function(method, url, data){
        return $http({
            method: method,
            url:url,
            data: JSON.stringify(data)
        })
    }

    this.logoutAdmin = function(method, url, data){
        return $http({
            method: method,
            url:url,
            data: JSON.stringify(data)
        })
    }

    this.categoty = function(method, url, data){
        return $http({
            method: method,
            url:url,
            data: JSON.stringify(data)
        })
    }
    this.fnTest = function(){
        console.log("Inside Service");
    }
})
