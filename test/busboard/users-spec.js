

describe("Users", function( ) {
    
    var spyMethods = ['addStop'];
    var spyModel = jasmine.createSpyObj( 'spyModel', spyMethods );
    var User = require("../../users");
    var user = new User( spyModel );
    var req, res;

    var testStop = {
        "route" : {
            "Description" : "Test route",
            "ProviderID" : "8",
            "Route" : "999"
        },
        "direction" : {
            "Text" : "NORTHBOUND",
            "Value" : "1",
        },
        "stop" : {
            "Text" : "Test Stop",
            "Value" : "TSTP"
        }
    };

    var testUser = {
        "username" : "testuser",
        "password" : "testpass",
        "joined" : new Date( ),
        "modified" : new Date( ),
        "HotStops" : []
    };

    beforeEach( function( ) {

        req = jasmine.createSpy('spyreq');
        req.session = {"authenticated" : "1234TEST"};
        req.body = testStop;

        res = jasmine.createSpy('spyres');
        res.send = jasmine.createSpy('spySend');
    });

    describe( 'addStop', function ( ) {

        it( "Should only save stops when user is logged in.", function( ) {

            req.session = {"authenticated" : false};

            user.addStop( req, res );
            expect( res.send ).toHaveBeenCalledWith({
                "message" : user.noUserMessage,
                "success" : false
            });
        });

        it( "Should only save when a stop is posted.", function( ) {
            req.body = undefined;

            user.addStop( req, res );
            expect( res.send ).toHaveBeenCalledWith({
                "message" : user.noStopMessage,
                "success" : false
            });
        });
    });

    it( "Should add the stop if user and stop are present.", function( ) {
        user.addStop( req, res );

        expect( spyModel.addStop.mostRecentCall.args[0] )
        .toEqual( req.session.authenticated );

        expect( spyModel.addStop.mostRecentCall.args[1] )
        .toEqual( testStop );

        callback = spyModel.addStop.mostRecentCall.args[2];
        callback( undefined, 1 );
        expect( res.send ).toHaveBeenCalledWith( {"message" : 'Stop added.', "success" : true} );

        callback( undefined, 0 );
        expect( res.send ).toHaveBeenCalledWith(  {"message": "We blew it.", "success" : false} );

        var err =  new Error( "Test addStop error" );
        var thrown;
        try {
            callback( err );
        }
        catch ( e ) {
            thrown = e;
        }
        expect( thrown ).toEqual( err );
    });

    xdescribe( 'logout', function( ) {
        it( "Should destroy the session on logout", function( ) {
            user.logout( req, res );
            expect( req.session.authenticated ).toEqual( null );
            expect( res.send ).toHaveBeenCalledWith( {"message" : user.logoutMessage, "success" : true} );
        });

        it( "Should report failure if there is no authenticated session", function( ) {
            req.session.authenticated = null;
            user.logout( req, res );
            expect( res.send ).toHaveBeenCalledWith( {"message" : user.noUserMessage, "success" : false} );
        });
    });

    describe( 'addUser', function( ) {
        
        beforeEach( function ( ) {
            req.body.username  =  "testuser";
            req.body.password  =  "testpass";

        });

        it( "should call on the model with posted credentials", function( ) {

            // Call the callback with current state of result
            var result = {"success" : true};
            spyModel.addUser = function( ) {};
            spyOn( spyModel, 'addUser' ).andCallFake( function( ) {
                spyModel.addUser.mostRecentCall.args[2]( result );
            });

            user.addUser( req, res );

            expect( spyModel.addUser.mostRecentCall.args[0] )
            .toEqual( req.body.username );

            expect( spyModel.addUser.mostRecentCall.args[1] )
            .toEqual( req.body.password );

            expect( res.send ).toHaveBeenCalledWith( {"message" : user.userAddedMessage, "success" : true } );

        });

        it( "should respond with user exists on model fail", function( ) { } );


    });
});
    


        
