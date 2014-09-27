

myApp.controller('categoryCtrl', function ($scope, $rootScope, $location, adminServices, $filter, $cookieStore){
    $scope.active = "0";

    $scope.validation =function(){
        flag = 0;
        if($scope.Category == "" || $scope.Category == undefined)
        {
            $scope.categoryRequired ="Category is required"
            flag = 1;
        }else{ $scope.categoryRequired =""}
        if($scope.active == "" || $scope.active == undefined)
        {
            $scope.activeRequired ="Select category Activation"
            flag = 1;
        }else{ $scope.activeRequired =""}

        if(flag == 1){
            return false;
        }
        return true;
    }

    var method = 'POST';
    var catUrl = "api/admin/category";
    $scope.CodeStatus = "";
    $scope.addCat = function() {
        if($scope.validation()){
            $scope.catDate = $filter('date')(new Date(), "yyyy-MM-dd");
            $scope.token = $cookieStore.get('loginToken');
            var  catData ={
                'cat_name' : $scope.Category,
                'flag' : $scope.active,
                'createdate' :  $scope.catDate,
                'token' : $scope.token
            }
            $scope.Category = "";
            $scope.active = "0";

            adminServices.categoty(method, catUrl, catData).
                success(function(response){
                    if(response.IsSuccess){
                        console.log("category insert success");
                    }else{
                        console.log(response.desc)
                    }
                }).
                error(function(response){
                    console.log("error");
                });
        }
    }
});