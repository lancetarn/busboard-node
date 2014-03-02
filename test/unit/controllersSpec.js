'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
	var q         =  null;
	var $scope    =  null;
	var ctrl      =  null;
	var uService  =  {};
	var aflash    =  {};
	var rS        =  {};
	var loc       =  {};

  beforeEach( module('myApp.controllers', 'myApp.services', 'flash' ) );


	describe( 'LoginCtrl', function ( ) {
		var validRsp =  { "data" : { "success" : true, "message" : "foobar" } },
			failRsp  =  { "data" : { "success" : false, "message" : "failed" } };

		beforeEach(inject(function($rootScope, $controller, userService, flash, $q, $location) {
			$scope  =  $rootScope.$new( );
			$scope.username  =  'foo';
			$scope.password  =  'bar';

			ctrl = $controller('LoginCtrl', {
				$scope       :  $scope,
				userService  :  userService,
				flash        :  flash,
				$rootScope   :  $rootScope,
				$location    :  $location
			});

			// Hang on for spying
			q         =  $q;
			uService  =  userService;
			aflash    =  flash;
			rS        =  $rootScope;
			loc       =  $location;
		}));

		describe( 'when receiving a good user and pass', function( ) {
			beforeEach( function( ) {
				spyOn( uService, 'login' ).andCallFake( function( user, pass ) {
					var deferred = q.defer( );
					validRsp.data.user = user;
					deferred.resolve( validRsp );
					return deferred.promise;
				});
			});

			it( 'should set the user on $rootScope', function( ) {
				$scope.authenticate( );
				// Applies the resolution of the promise.
				rS.$apply( );
				expect( rS.user ).toEqual( $scope.username );
			});

			it( 'should flash a message', function( ) { } );
			it( 'should change the location', function( ) { } );
		});
	});
});

