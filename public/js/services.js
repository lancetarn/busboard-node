'use strict';

/* Services */

angular.module('myApp.services', [])
  .factory('userService', ['$http', function($http) {
    var storagePrefix = 'hotstop_';
    return {
        login : function( username, password ) {
            var config = {
                method : 'POST',
                url : 'api/login',
                data : {"username" : username, "password" : password}
            };
            return $http(config).then( function( rsp ) {
                return rsp.data;
            } );
        },

        logout : function( ) {
            var config = {
                method : 'DELETE',
                url : '/api/logout',
            };

            return $http( config )
                .success( function( data, status, headres, config ) {
                    return data;
                });
        },

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
            if ( localStorage ) {
                localStorage.setItem( storagePrefix + HotStop.route.Route, HotStop );
            }
            
            var config = {
                method : 'POST',
                url : 'api/stops',
                data : HotStop
            };
            return $http(config);
        },

        getHotStops : function( ) {
            return $http({
                method : 'GET',
                url : 'api/stops',
            })
            .then( function( rsp ) {
                return rsp.data.HotStops;
            });
        },

        removeHotStop : function( stop ) {
            return $http({
                method : 'POST',
                url : 'api/stops/delete',
                data : stop,
            })
            .then( function ( rsp ) {
                return rsp.data.message;
            });
        },

        getStoragePrefix : function( ) {
            return storagePrefix;
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
            
