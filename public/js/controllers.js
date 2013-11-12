'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('RouteCtrl', ['$scope', 'nexTripService', function($scope, nexTripService) {
    $scope.getRoutes = function( ) {
      // Grab all the routes from NexTrip
        nexTripService.getRoutes( )
      .then( function(routes){
        console.log(routes);
        $scope.routes = routes;
     });
    };        

    $scope.getDirections = function( ) {
        nexTripService.getDirections( $scope.selectedRoute )
        .then( function(directions) {
          console.log(directions);
          $scope.directions = directions;
        });
    };

    $scope.getStops = function( ) {
        nexTripService.getStops( $scope.selectedRoute, $scope.selectedDirection )
        .then( function(stops) {
          console.log(stops);
          $scope.stops = stops;
        });
    };

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

    $scope.getDepartures = function( ) {
        nexTripService.getDepartures($scope.HotStop)
        .then( function(departures) {
            console.log(departures);
            $scope.departures = departures;
        });
    };

    $scope.saveHotStop = function( ) {
        var config = {
            method : 'POST',
            url : 'api/stops',
            data : {
                "route" : $scope.selectedRoute,
                "direction" : $scope.selectedDirection,
                "stop" : $scope.selectedStop
            }
        };
        console.log(config.data);
        $http(config)
        .then( function(rsp) {
            console.log(rsp);
        });

    };

  }])
  
  .controller('LoginCtrl', ['$scope', 'userService', function( $scope, userService ) {
    $scope.authenticate = function( ) {
        $scope.authenticated = userService.login( $scope.username, $scope.password );
        
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

  
