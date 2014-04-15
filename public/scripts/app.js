'use strict';
angular.module('modEcommerce', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
    }).when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl'
    }).when('/404', { templateUrl: 'views/404.html' }).otherwise({ redirectTo: '/404' });
  }
]);