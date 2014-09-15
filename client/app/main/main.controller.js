'use strict';

angular.module('appShopApp')
  .controller('MainCtrl', function ($scope, $http) {
        var mathod = 'POST';
        var inserturl = "http://192.168.0.17:9000/api/admin";
        $scope.CodeStatus = "";
        $scope.save = function() {
            //http://192.168.0.17:3000/v0/admin?firstname=Mehul &user=me&pass=4889&email=me@gmail.com
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

//        var jdata = 'mydata='+JSON.stringify(formData);

            $http({
                method: mathod,
                url:inserturl,// 'http://192.168.0.17:3000/v0/admin?firstname=Mehul Mali&user=Mehul4889&pass=hi&email=mehul@gmail.com',
                data: JSON.stringify(formData),
//                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                cache: $templateCache
            }).
                success(function(response) {
                    if(response.IsSuccess){
                        console.log("success");

                        alert(response.msg)
                    }else{
                        alert(response.msg)
                        console.log(response.desc)
                    }
                    console.log("success");
                    $scope.codeStatus = response.msg;
                    console.log($scope.codeStatus);
                }).
                error(function(response) {
                    console.log("error");
                    alert("Error")

                });
        }

  });
