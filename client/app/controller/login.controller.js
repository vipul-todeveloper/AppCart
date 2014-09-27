
myApp.controller('loginCtrl', function ($scope, $location, adminServices, $cookieStore){
    $scope.validation =function(){
        flag = 0;
        if($scope.uName == "" || $scope.uName == undefined)
        {
            $scope.userRequired ="Username is required"
            flag = 1;
        }else{ $scope.userRequired =""}
        if($scope.password == "" || $scope.password == undefined)
        {
            $scope.passwordRequired ="Password is required"
            flag = 1;
        }else{ $scope.passwordRequired =""}

        if(flag == 1){
            return false;
        }
        return true;
    }

    var method = 'POST';
    var logUrl = "api/admin/login";
    $scope.CodeStatus = "";
    $scope.login = function() {
        if($scope.validation()){
            var logData ={
                'user' : this.uName,
                'pass' : this.password
            }
            this.uName = "";
            this.password = "";

            /*----- SERVICE CALL-----*/
            adminServices.loginAdmin(method, logUrl, logData).
                success(function(response) {
                    if(response.IsSuccess){
                        console.log("success");
                        $cookieStore.put('loginToken',response.token);
                        if(response.token) {
                            $location.path("/home");
                        }
                    }else{
                        console.log(response.desc)
                    }
                    console.log("success");
                    $scope.codeStatus = response.msg;
                    console.log($scope.$$phase);
                    if(! $scope.$$phase){
                        $scope.$apply();
                    }
                    console.log($scope.codeStatus);
                }).
                error(function(response) {
                    console.log("error");
                });
        }
    }

});