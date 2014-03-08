'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

	.controller('HotStopCtrl', ['$rootScope', '$scope', 'userService', 'nexTripService', 'flash', function( $rootScope, $scope, userService, nexTripService, flash ) {
		
		var refreshInterval = 120000; // Two minutes

		// Initially get all stops
		userService.getHotStops( )
		.then( function ( HotStops ) {
			$scope.HotStops  =  HotStops;
		});

		// Get and display departures for the set HotStop from nexTrip.
		$scope.showDepartures = function( index, HotStop ) {

			// If we already have them, just toggle
			if ( HotStop.departures && HotStop.updatedAt > ( Date.now( ) - refreshInterval ) ) {
				$scope.toggleDepartures( index );
				return;
			}

			// Set the new departures on the hotstop
			getDepartures( HotStop ).then(
				function( departures ) {
					$scope.HotStops[index].departures  =  departures;
					$scope.HotStops[index].updatedAt = Date.now( );
					console.log( departures );
				},
				function( error ) {
					flash( "Sorry, there was an error getting departures." );
				}
			);
		};

		$scope.toggleDepartures = function( index ) {
			$scope.HotStops[index].collapse  =  ! $scope.HotStops[index].collapse;
		};

		$scope.removeHotStop = function( index, HotStop ) {
			userService.removeHotStop( HotStop )
			.then(
				// Success
				function( ) {
					$scope.HotStops.splice( index, 1 );
					flash( "Stop removed." );
			},
				// Error
				function( ) {
					flash( "Sorry, there was an error deleting the stop." );
			});
		};

		$rootScope.$on( 'saveHotStop', function( e, HotStop ) {
			$scope.HotStops = $scope.HotStops || [];
			$scope.HotStops.push( HotStop );

		});

		function getDepartures( HotStop ) {
			return nexTripService.getDepartures( HotStop );
		}
	}])

	.controller('RouteCtrl', [ '$scope', 'userService', 'nexTripService', 'flash', function( $scope, userService, nexTripService, flash ) {

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

		// Set the current HotStop on $scope, if it is complete.
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


	.controller( 'NavCtrl', [
			'$rootScope',
			'$scope',
			'$log',
			'$modal',
			'userService',
			'flash',
			function( $rootScope, $scope, $log, $modal, userService, flash ) {

		// Check for session on initial pageload.
		userService.getSessionUser( )
		.then(
			function ( user ) {
				$rootScope.user  =  user;
			},
			function ( e ) {
				$log( e );
			}
		);

		$scope.open  =  function( action ) {

			if ( action === 'Logout' ) return logout( );

			var modalInstance  =  $modal.open({
				templateUrl : '/partials/' + action.toLowerCase( ),
				controller  : action + 'Ctrl'
			});
			modalInstance.result.then( function( user ) {
				flash( "Welcome back, " + user + "!" );
			});
		};

		$scope.logout  =  function( ) {
			userService.logout( )
			.then( function( resp ) {
				$rootScope.user  =  false;
				flash( resp.data.message );
			});
		};
	}])


	.controller('LoginCtrl', [
			'$rootScope',
			'$scope',
			'$modalInstance',
			'userService',
			function( $rootScope, $scope, $modalInstance, userService ) {


		$scope.authenticate = function( ) {
			userService.login( $scope.username, $scope.password )
			.then(
				function( rsp ) {
					var path;
					if ( rsp.data.success ) {
						$rootScope.user  =  rsp.data.user;
						$modalInstance.close( rsp.data.user );
					}
					else {
						$scope.notice  =  rsp.data.message;
					}
				},
				function( e ) {
					console.log( e );
				}
			);
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
  }]);


