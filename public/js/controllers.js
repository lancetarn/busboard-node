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
           console.log( e, HotStop );
           $scope.HotStops.push( HotStop );
       });
  }])

  .controller('RouteCtrl', ['$scope', 'userService', 'nexTripService', 'flash', function($scope, userService, nexTripService, flash ) {
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
        .then( function(stops) {
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
        .then( function(departures) {
            console.log(departures);
            $scope.departures = departures;
        });
    };

    // Save the set HotStop to the user.
    $scope.saveHotStop = function( ) {
        userService.saveHotStop( $scope.HotStop )
        .then( function(rsp) {
            flash(rsp.data.message);
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
  
  .controller('LoginCtrl', ['$rootScope', '$scope', 'userService', function( $rootScope, $scope, userService ) {
    $scope.authenticate = function( ) {
        $rootScope.authenticated = userService.login( $scope.username, $scope.password );
        
    };
    $scope.logout = function( ) {
        userService.logout( );
    };
  }])

  .controller('RegisterCtrl', ['$scope', '$location', 'userService', 'flash', function( $scope, $location, userService, flash ) {
    $scope.addUser = function( ) {
        var result = userService.addUser( $scope.newuser, $scope.newpass );
        result.then( function(resp) {
            console.log( resp );
            if ( resp.data.success ) {
                flash("Thanks for registering!");
                $location.path("/login");
            }
            else {
                flash(resp.data.message);
            }
        });
    };
  }])
  
  .controller('IndexCtrl', ['$scope', 'flash', function( $scope ) {
  }]);

  
