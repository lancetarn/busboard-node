'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('myApp.services'));

  describe('userService', function() {
      var service, $httpBackend, store, mockStop;
      // Set up mock backend
      beforeEach( inject( function( userService, _$httpBackend_ ) {
         service = userService;
        $httpBackend = _$httpBackend_; 
        $httpBackend.when( 'POST', 'api/stops' ).respond( {"data":mockStop} );
        $httpBackend.when( 'DELETE', '/api/logout' ).respond( {"data" : {"message" : "logged out", "success" : true}} );
      }));

      // Mock up localStorage
      beforeEach( function( ) {
          store = {},
          mockStop = {
              "route" : { "Route" : "999" },
              "direction" : "NORTHBOUND",
              "stop" : "TEST STOP"
          };
			spyOn(localStorage, 'getItem').andCallFake(function (key) {
				if ( store[key] ) {
					return store[key];
				}
				return null;
			});
          spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
            return store[key] = value + '';
          });
          spyOn(localStorage, "clear").andCallFake(function () {
              store = {};
          });
      });

      afterEach( function( ) {
          $httpBackend.flush( );
      });


		it('should call $http with proper config', function( ) {
			$httpBackend.expectPOST( 'api/stops', mockStop );
			console.log(mockStop);
			service.saveHotStop( mockStop );
		});
        
        it('should try to store the stop locally', function( ) {
            service.saveHotStop( mockStop );
            expect( localStorage.setItem ).toHaveBeenCalledWith( service.getStorageKey( ), JSON.stringify( [mockStop] ) );
        });

        it( 'should log the user out', function( ) {
            $httpBackend.expect( 'DELETE', '/api/logout' );
            service.logout( );
        });
    });
});
