'use strict';

myApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'app/views/loginDemo.html',
        controller: 'loginCtrl'
      })
      .when('/category', {
        templateUrl: 'app/views/category.html',
        controller: 'categoryCtrl'
      })
      .when('/user', {
        templateUrl: 'app/views/user.html',
        controller: 'userCtrl'
      })
      .when('/product', {
        templateUrl: 'app/views/product.html',
        controller: 'productCtrl'
      })
      .when('/logout', {
        templateUrl: 'app/views/loginDemo.html',
        controller: 'logoutCtrl'
      });
  });

myApp.run(function($rootScope,$location,$cookieStore){
    $rootScope.$on("$routeChangeStart", function(event){

        var token = $cookieStore.get("loginToken");
        if(token == undefined){
            $rootScope.logHide = false;
        }else{
            $rootScope.logHide = true;
            $rootScope.userName = "Admin";
            if($location.$$path == "/login"){
                $location.path("/home");
            }

        }
        console.log($rootScope.logHide);
        if($rootScope.logHide == false ){
            $location.path("/login");
        }
    });
});

