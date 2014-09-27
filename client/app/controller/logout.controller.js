
myApp.controller('logoutCtrl', function ($scope, $rootScope, $location, adminServices, $cookieStore){
    var method = "POST";
    var logoutUrl = "api/admin/logout";
    var getToken = $cookieStore.get('loginToken');
    var tokenData ={
        'token' : getToken
    }
    adminServices.logoutAdmin(method, logoutUrl, tokenData).
        success(function(response) {
            if(response.IsSuccess){
                console.log("logout successfully");
                $cookieStore.remove('loginToken');
                $rootScope.logHide = undefined;
                $location.path("/login");
            } else {
                console.log(response.desc)
            }
            $scope.codeStatus = response.msg;
//            if(! $scope.$$phase){
//                $scope.$apply();
//            }
        }).
        error(function(response){
            console.log("error");
        })

});