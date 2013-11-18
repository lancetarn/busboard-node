

describe("Users", function( ) {

    var spyModel = jasmine.createSpy('spyModel');
    spyModel.addStop = jasmine.createSpy('addStop');
    var UserAPI = require("../../users");
    var userAPI = new UserAPI( spyModel );
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

    beforeEach( function( ) {

        req = jasmine.createSpy('spyreq');
        req.session = {"authenticated" : "1234TEST"};
        req.body = testStop;

        res = jasmine.createSpy('spyres');
        res.send = jasmine.createSpy('spySend');
    });

    it( "Should only save stops when user is logged in.", function( ) {    

        req.session = {"authenticated" : false};

        userAPI.addStop( req, res );
        expect( res.send ).toHaveBeenCalledWith({"message" : userAPI.noUserMessage, "success" : false});
    });

    it( "Should only save when a stop is posted.", function( ) {
        req.body = undefined;

        userAPI.addStop( req, res );
        expect( res.send ).toHaveBeenCalledWith({"message" : userAPI.noStopMessage, "success" : false});
    });

    it( "Should add the stop if user and stop are present.", function( ) {
        userAPI.addStop( req, res );
        expect(spyModel.addStop).toHaveBeenCalledWith( req.session.authenticated, testStop );
    });
        
});
    


        
