'use strict';

/* Services */

angular.module('myApp.services', []).
  factory('userService', ['$http', function($http) {
    return {
        login : function( username, password ) {
            var config = {
                method : 'POST',
                url : 'api/login',
                data : {"username" : username, "password" : password}
            };
            return $http(config).success( function(data, status, headers, config) {
                return data.authenticated;
            } );
        },

        logout : function( ) { alert( 'logged out!' ); },

        addUser : function( username, password ) {
            return $http({
                method : 'POST',
                url : '/api/user',
                data : {"username" : username, "password" : password}
                } )
            .success(function(data, status, headers, config) {
                return data.message;
            });
        }
    };
}]);
