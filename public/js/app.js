// Declare app level module which depends on filters, and services

console.log('Loading myApp');
angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'flash'
]).
config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
        controller: 'IndexCtrl'
    }).
    when('/login', {
      templateUrl: 'partials/login',
      controller: 'LoginCtrl'
    }).
    when('/mystops', {
      templateUrl: 'partials/mystops',
      controller: 'MyStopCtrl'
    }).
    when('/register', {
        templateUrl: 'partials/register',
        controller: 'RegisterCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
}]);
