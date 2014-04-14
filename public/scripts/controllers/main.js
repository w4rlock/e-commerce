'use strict';

/*
 * TODO
 * 
 */

var app = angular.module('modEcommerce');

app.controller('MainCtrl', function ($scope) { });

app.controller('ProfileCtrl', function ($scope, $rootScope, $modal, $http) { 
  $scope.loadingValidacion = false;
  $rootScope.user = {};

  $http.get('/api/profile')
  .success(function(user, status, headers, config) {
    console.log(user);
    $rootScope.user = user;
    $scope.asociaciones = user.asociaciones;
  })
  .error(function(data, status, headers, config) {
    console.log("Error en /api/profile: no se pudo traer la peticion ajax");
  });

  var modalCtrl = function($scope, $modalInstance) {
    $scope.ok = function() {$modalInstance.close();};
    $scope.cancel = function() {$modalInstance.dismiss('cancel');};
  };

  $scope.openPictureDialog = function() {
    var modalInstance = $modal.open({
      templateUrl: 'views/modalPicture.html',
      controller: modalCtrl, 
      resolve: {}
    });
  };
});

app.controller('LoginCtrl', function ($scope, $rootScope, $http, $location, $window) {
  $scope.user = {email: '', password: ''};
  $rootScope.isAuthenticated = $rootScope.isAuthenticated || false;
  $scope.wellcome = '';
  $scope.message = '';

  $scope.submit = function () {
    $http
      .post('/login', $scope.user)
      .success(function(data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $rootScope.isAuthenticated = true;
        $scope.wellcome = "Bienvenido";
        $location.path('/profile');
      })
      .error(function(data, status, headers, config) {
        delete $window.sessionStorage.token;
        $rootScope.isAuthenticated = false;
        $scope.message = "Nombre de usuario o Password inválido";
        $scope.wellcome = "";
      });
  };

  $rootScope.logout = function () {
    $rootScope.isAuthenticated = false;
    $scope.message = "";
    $scope.wellcome = "";
    delete $window.sessionStorage.token;
  };
});

app.controller('RegisterCtrl', function ($scope, $rootScope, $http, $window) {
  $scope.isRegisted = false;
  $scope.email = "";
  $scope.checkPassword = function() {
    var dontmatch = $scope.user.password !== $scope.user.repassword;
    $scope.form.repassword.$error.dontMatch = dontmatch;
    $scope.form.$invalid = dontmatch;
  };
  $scope.submit = function () {
    console.log($scope.user);
    var user = {
      email: $scope.user.email,
      nombre: $scope.user.name,
      apellido: $scope.user.lastname,
      password: $scope.user.password
    };

    $http
      .post('/signup', user)
      .success(function(data, status, headers, config) {
        $scope.isRegisted = true;
      })
      .error(function(data, status, headers, config) {
        $scope.isRegisted = false;
        console.log(data);
        if (data.err === "ERR_EMAIL_DUPLICATED") {
          $scope.message = "El usuario ya ha sido registrado, intenta con otro email.";
        } else {

          $scope.message = "Por favor intenta de nuevo, ha ocurrido un error en el servidor";
        }
      });
  };
});


app.factory('authInterceptor', function($rootScope, $q, $window) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        // if not authorized access
        console.log(rejection.status);
      } 
      return $q.reject(rejection);
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
