'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('RouteCtrl', ['$scope', '$http', function($scope, $http) {
    var nexTripBase = 'http://svc.metrotransit.org/NexTrip';
    var nexTripQuery = '?format=json&callback=JSON_CALLBACK';
    $scope.init = function( ) {
      // Grab all the routes from NexTrip
      $http.jsonp( nexTripBase + '/Routes' + nexTripQuery )
      .then( function(rsp){
        console.log(rsp.data);
        $scope.routes = rsp.data;
     });
    };        

    $scope.getDirections = function( ) {
      var directionUrl = nexTripBase + '/Directions/' + $scope.selectedRoute.Route + nexTripQuery;
      $http.jsonp( directionUrl )
      .then( function(rsp) {
          console.log(rsp);
          $scope.directions = rsp.data;
        });
    };

    $scope.getStops = function( ) {
        var stopUrl = nexTripBase + '/Stops/' + $scope.selectedRoute.Route + '/' +$scope.selectedDirection.Value + nexTripQuery;
        $http.jsonp(stopUrl)
        .then( function(rsp) {
          console.log(rsp.data);
          $scope.stops = rsp.data;
        });
    };

    $scope.getDepartures = function( ) {
        var departureUrl = nexTripBase +
            '/' + $scope.selectedRoute.Route +
            '/' + $scope.selectedDirection.Value +
            '/' + $scope.selectedStop.Value +
            nexTripQuery;
        $http.jsonp(departureUrl)
        .then( function(rsp) {
            console.log(rsp);
            $scope.departures = rsp.data;
        });
    };

  }])
  
  .controller('LoginCtrl', ['$scope', 'userService', function( $scope, userService ) {
    $scope.authenticate = function( ) {
        userService.login( $scope.username, $scope.password );
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

  
