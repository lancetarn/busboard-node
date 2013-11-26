'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  var $scope = null;
  var ctrl = null;

  var mockService = {
      login : function( user, pass ) {
          return user + pass;
      },

      logout : function( ) {
          return 'logged out';
      }
  };

  beforeEach(module('myApp.controllers'));

  beforeEach(inject(function($rootScope, $controller, flash) {
      $scope = $rootScope.$new();
      $scope.username = 'foo';
      $scope.password = 'bar';

      ctrl = $controller('LoginCtrl', { 
          $scope: $scope,
          userService : mockService,
          flash : flash
      });
  }));

  it('should take a username and password', function() {
    expect(typeof $scope.authenticate).toEqual('function');  
    $scope.authenticate();
    expect($scope.authenticated).toEqual('foobar');
  });

});

