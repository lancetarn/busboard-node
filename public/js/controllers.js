'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('hotStopCtrl', ['$scope', 'userService', function( $scope, userService ) {
      userService.getHotStops( )
      .then( function( HotStops ) {
          console.log(HotStops);
          $scope.HotStops = HotStops;
          console.log($scope);
         });
  }])

  .controller('RouteCtrl', ['$scope', 'userService', 'nexTripService', 'flash', function($scope, userService, nexTripService, flash ) {
    $scope.getRoutes = function( ) {
      // Grab all known routes from NexTrip.
        nexTripService.getRoutes( )
      .then( function(routes){
        console.log(routes);
        $scope.routes = routes;
     });
    };        

    // Get the directions available for a given route.
    $scope.getDirections = function( ) {
        nexTripService.getDirections( $scope.selectedRoute )
        .then( function(directions) {
          console.log(directions);
          $scope.directions = directions;
        });
    };

    // Get the stops for a given route, ordered by direction.
    $scope.getStops = function( ) {
        nexTripService.getStops( $scope.selectedRoute, $scope.selectedDirection )
        .then( function(stops) {
          console.log(stops);
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
            console.log(rsp);
            flash(rsp.message);
            $scope = {};
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

  
