'use strict';

/* Services */

angular.module('myApp.services', [])
  .factory('userService', ['$rootScope', '$http', function( $rootScope, $http) {
    var storageKey = 'hotstop_';
    return {
        login : function( username, password ) {
            var config = {
                method : 'POST',
                url : 'api/login',
                data : {"username" : username, "password" : password}
            };
            return $http( config );
				},

		logout : function( ) {
			var config = {
				method : 'DELETE',
				url : '/api/logout',
			};

			return $http( config );
		},

		getSessionUser : function( ) {
			var config = {
				method : 'GET',
				url : '/api/user',
			};
			return $http( config ).then( function( rsp ) {
				return  rsp.data.user;
			});
		},

        addUser : function( username, password ) {
            return $http({
                method  :  'POST',
                url     :  '/api/user',
                data    :  {"username" : username, "password" : password}
                } )
            .success(function(data, status, headers, config) {
                return data.message;
            });
        },

        // Save a stop into an array in localStorage,
        // then POST it.
        saveHotStop : function( HotStop ) {

            if ( localStorage ) {
				var stopJSON  =  localStorage.getItem( storageKey );
                var stops = JSON.parse( stopJSON );
                stops = stops || [];
                stops.push( HotStop );
                localStorage.setItem( storageKey, JSON.stringify( stops ) );
            }

            var config = {
                method : 'POST',
                url : 'api/stops',
                data : HotStop
            };
            return $http(config);
        },

        getLocalStops : function( ) {
            if ( localStorage ) {
                return JSON.pars( localStorage.getItem( storageKey ) );
            }
            return false;
                        },

        // Gets stops, syncs localStorage
        getHotStops : function( ) {

            return $http({
                method : 'GET',
                url : 'api/stops',
            })
            .then( function( rsp ) {

                if ( rsp.data.HotStops && localStorage ) {
                    localStorage.setItem( storageKey, JSON.stringify( rsp.data.HotStops ) );
                }

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

        getStorageKey : function( ) {
            return storageKey;
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
