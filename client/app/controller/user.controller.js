
myApp.controller('userCtrl', function ($scope, adminServices) {
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email);
    }
    function validateName(name) {
        var re = /^[a-zA-Z]+$/;
        return re.test(name);
    }
    function validateUserName(username) {
        var re = /^[a-zA-Z0-9]+$/;
        return re.test(username);
    }

    $scope.validation =function(){
        flag = 0;
        if($scope.uName == "" || $scope.uName == undefined)
        {
            $scope.userRequired ="Username is required"
            flag = 1;
        }else if(validateUserName($scope.uName) != true){
            $scope.userRequired ="Only alphanumeric allowed";
            flag = 1;
        }else{
            $scope.userRequired = "";
        }


        if($scope.password == "" || $scope.password == undefined)
        {
            $scope.passwordRequired ="Password is required"
            flag = 1;
        }else{ $scope.passwordRequired ="" }

        /*..... FIRST NAME VALIDATION .....*/
        if($scope.fName == "" || $scope.fName == undefined)
        {
            $scope.nameRequired ="Firstname is required"
            flag = 1;
        }else if(validateName($scope.fName) != true){
            $scope.nameRequired ="Only alphabet allowed";
            flag = 1;
        }else{
            $scope.nameRequired = "";
        }

        /*..... EMAIL VALIDATION .....*/
        if($scope.email == "" || $scope.email == undefined)
        {
            $scope.emailRequired ="Email is required"
            flag = 1;
        }else if(validateEmail($scope.email) != true){
            $scope.emailRequired ="Enter valid email"
            flag = 1;
        }else{
            $scope.emailRequired =""
        }


        if(flag == 1){
            return false;
        }
        return true;
    }

    var method = 'POST';
    var inserturl = "/api/admin";
    $scope.CodeStatus = "";
    adminServices.fnTest();
    $scope.save = function() {
        if($scope.validation()){

            var formData = {
                'firstname' : this.fName,
                'user' : this.uName,
                'pass' : this.password,
                'email' : this.email
            }

            this.fName = "";
            this.uName = "";
            this.password = "";
            this.email = "";

            adminServices.addAdmin(method, inserturl, formData).
                success(function(response) {
                    if(response.IsSuccess){
                        console.log("success");


                    }else{

                        console.log(response.desc)
                    }
                    console.log("success");
                    $scope.codeStatus = response.msg;
                    console.log($scope.$$phase);
    //                    if(! $scope.$$phase){
    //                        $scope.$apply();
    //                    }
                    console.log($scope.codeStatus);
                }).
                error(function(response) {
                    console.log("error");


                });
            console.log($scope.codeStatus);
        }
    }
});



