'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('hotStopCtrl', ['$rootScope', '$scope', 'userService', 'flash', function( $rootScope, $scope, userService, flash ) {
      userService.getHotStops( )
      .then( function( HotStops ) {
          $scope.HotStops = HotStops;
         });

       $scope.removeHotStop = function( HotStop ) {
           userService.removeHotStop( HotStop )
           .then(
               function( ) {
                $scope.HotStops.splice( $scope.HotStops.indexOf( HotStop ), 1 );
                flash( "Stop removed." );
           },
                function( ) {
                    flash( "Sorry, there was an error deleting the stop." );
           });
       };

       $rootScope.$on( 'saveHotStop', function( e, HotStop ) {
			$scope.HotStops = $scope.HotStops || [];
			$scope.HotStops.push( HotStop );

       });
  }])

  .controller('RouteCtrl', [ '$scope', 'userService', 'nexTripService', 'flash', function( $rootScope, $scope, userService, nexTripService, flash ) {

	$scope.authenticated = $rootScope.authenticated;

    // Grab all known routes from NexTrip.
    $scope.getRoutes = function( ) {
        nexTripService.getRoutes( )
        .then( function(routes){
          $scope.routes = routes;
     });
    };        

    // Get the directions available for a given route.
    $scope.getDirections = function( ) {
        nexTripService.getDirections( $scope.selectedRoute )
        .then( function(directions) {
          $scope.directions = directions;
        });
    };

    // Get the stops for a given route, ordered by direction.
    $scope.getStops = function( ) {
        nexTripService.getStops( $scope.selectedRoute, $scope.selectedDirection )
        .then( function( stops ) {
          $scope.stops = stops;
        });
    };

    // Set the current HotStop, if it is complete.
    $scope.setHotStop = function( ) {
        if ( $scope.selectedRoute.Route &&
             $scope.selectedDirection.Value &&
             $scope.selectedStop.Value
           ) {
            $scope.HotStop = {
                route : $scope.selectedRoute,
                direction : $scope.selectedDirection,
                stop : $scope.selectedStop
            };
       }
    };

    // Get departures for the set HotStop from nexTrip.
    $scope.getDepartures = function( ) {
        nexTripService.getDepartures($scope.HotStop)
        .then( function( departures ) {
            console.log(departures);
            $scope.departures = departures;
        });
    };

    // Save the set HotStop to the user.
    $scope.saveHotStop = function( ) {
        userService.saveHotStop( $scope.HotStop )
        .then( function( rsp ) {
            flash( rsp.data.message );
            $scope.$emit( 'saveHotStop', $scope.HotStop );
            $scope.routes = null;
            $scope.stops = null;
            $scope.directions = null;
            $scope.selectedRoute = null;
            $scope.selectedStop = null;
            $scope.selectedDirection = null;
            $scope.HotStop = null;
        });
    };

  }])
  
  .controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'userService', 'flash', function( $rootScope, $scope, $location, userService, flash ) {
    $scope.authenticate = function( ) {
        userService.login( $scope.username, $scope.password )
        .then( function( data ) {
            console.log( data );
            var path = data.success ? '/' : '/login';
            $rootScope.authenticated = data.success;
            flash( data.message );
            $location.path( path );
        });
    };

    $scope.logout = function( ) {
     	userService.logout( )
		.then( function( resp ) {
			console.log( resp );
			flash( resp.data.message );
			$rootScope.authenticated = false;
		});
    };
  }])


  .controller('RegisterCtrl', ['$rootScope', '$scope', '$location', 'userService', 'flash', function( $rootScope, $scope, $location, userService, flash ) {
    $scope.addUser = function( ) {
        var result = userService.addUser( $scope.newuser, $scope.newpass );
        result.then( function( resp ) {
            console.log( resp );
            if ( resp.data.success ) {
                flash( resp.data.message );
				$rootScope.authenticated = resp.data.success;
                $location.path("/");
            }
            else {
                flash(resp.data.message);
            }
        });
    };
  }])
  
  .controller('IndexCtrl', ['$rootScope', '$scope', 'flash', function( $rootScope, $scope, flash ) {
	  console.log( $scope );
	  $scope.authenticated = $rootScope.authenticated;
  }]);


