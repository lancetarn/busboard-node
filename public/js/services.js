'use strict';

/* Services */

angular.module('myApp.services', [])
  .factory('userService', ['$http', function($http) {
    return {
        login : function( username, password ) {
            var config = {
                method : 'POST',
                url : 'api/login',
                data : {"username" : username, "password" : password}
            };
            return $http(config).success( function(data, status, headers, config) {
                return data;
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
        },

        saveHotStop : function( HotStop ) {
            
            var config = {
                method : 'POST',
                url : 'api/stops',
                data : HotStop
            };
            return $http(config);
        },

        getHotStops : function( ) {
            console.log( 'called' );
            return $http({
                method : 'GET',
                url : 'api/stops',
            })
            .then( function( rsp ) {
                console.log(rsp);
                return rsp.data.HotStops;
            });
    }
};
}])

    .factory('nexTripService', ['$http', function($http) {
        var nexTripBase = 'http://svc.metrotransit.org/NexTrip';
        var nexTripQuery = '?format=json&callback=JSON_CALLBACK';

        return {
            getRoutes : function( ) {
              return $http.jsonp( nexTripBase + '/Routes' + nexTripQuery )
              .then(function(rsp) {
                  return rsp.data;
              });
            },

            getDirections : function( route ) {
              var directionUrl = nexTripBase + '/Directions/' + route.Route + nexTripQuery;
              return $http.jsonp( directionUrl )
                .then( function(rsp) {
                    return rsp.data;
                });
            },

            getStops : function( route, direction ) {
                var stopUrl = nexTripBase + '/Stops/' + route.Route + '/' + direction.Value + nexTripQuery;
                return $http.jsonp( stopUrl )
                    .then( function(rsp) {
                        return rsp.data;
                });
            },

            getDepartures : function( HotStop ) {
                var departureUrl = nexTripBase +
                    '/' + HotStop.route.Route +
                    '/' + HotStop.direction.Value +
                    '/' + HotStop.stop.Value +
                    nexTripQuery;
                return $http.jsonp( departureUrl )
                    .then(function(rsp) { return rsp.data; });
            }
        };
    }]);
            
