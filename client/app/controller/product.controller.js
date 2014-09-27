myApp.controller('productCtrl', function ($scope, $location, adminServices, $cookieStore){
    function validateproDiscount(discount) {
        var re = /^[0-9]+$/;
        return re.test(discount);
    }

    $scope.validation =function(){
        flag = 0;
        if($scope.proName == "" || $scope.proName == undefined)
        {
            $scope.proNameRequired ="Product name is required"
            flag = 1;
        }else{ $scope.proNameRequired =""}
        if($scope.proDetail == "" || $scope.proDetail == undefined)
        {
            $scope.proDetailRequired ="Product detail is required"
            flag = 1;
        }else{ $scope.proDetailRequired =""}
        if($scope.proImage == "" || $scope.proImage == undefined)
        {
            $scope.proImageRequired ="Select Product image"
            flag = 1;
        }else{ $scope.proImageRequired =""}
        if($scope.proPrice == "" || $scope.proPrice == undefined)
        {
            $scope.proPriceRequired ="Product price is required"
            flag = 1;
        }else{ $scope.proPriceRequired =""}
//        if($scope.proDiscount == "" || $scope.proDiscount == undefined)
//        {
//            $scope.proDiscountRequired ="Product price is required"
//            flag = 1;
//        }else{ $scope.proDiscountRequired =""}
        if($scope.catName == "" || $scope.catName == undefined)
        {
            $scope.catNameRequired ="Product price is required"
            flag = 1;
        }else{ $scope.catNameRequired =""}

        if(validateproDiscount($scope.proDiscount) != true){
            $scope.proDiscountRequired ="Enter number only"
            flag = 1;
        }else{
            $scope.proDiscountRequired =""
        }

        if(flag == 1){
            return false;
        }
        return true;
    }

    var method = 'POST';
    var logUrl = "api/admin/product";
    $scope.CodeStatus = "";
    $scope.insertProduct = function() {
        if($scope.validation()){

        }
    }


});