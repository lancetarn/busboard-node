
var bcrypt = require('bcrypt');

    
function Users( UserModel ) {
    this.model = UserModel;
    this.noUserMessage = "No user found.";
    this.noStopMessage = "Invalid stop received.";
    this.logoutMessage = "You have successfully logged out.";
    this.userAddedMessage = "Welcome to busboard, ";
    this.userAlreadyExistsMessage = "Sorry, that username is in use.";
}

Users.prototype.addStop = function (req, res) {
    var userId = req.session.authenticated;

    if ( ! userId ) return res.send( {"message" : this.noUserMessage, "success" : false} );

    var HotStop = req.body;

    if ( ! HotStop ) return res.send( {"message" : this.noStopMessage, "success" : false} );

    this.model.addStop(userId, HotStop, function(err, count) {
        if (err) throw err;

        if (count < 1) return res.send( {"message": "We blew it.", "success" : false});

        res.send({"message" : 'Stop added.', "success" : true} );
    });
};

// Verify credentials, set session user to user._id
Users.prototype.login = function (req, res) {
    console.log( req.session.authenticated );
    if ( req.session.authenticated ) res.send({"message" : "Already logged in.", "success" : true});

    var creds = this.model.getCredsFromReq(req);
    
    // Try to find the user. 
    this.model.getByName( creds.user, function(err, result) {
        if ( err ) throw err;

        if ( result.length > 1 ) throw new Error( 'Found non-unique username: ' + creds.user );
        
        if ( result.length === 0 ) {
            return res.send( {"message" : 'Found no user by that name.', "success" : false} );
        }

        var user = result[0];

        // Found one and only one user. Check pass with bcrypt, send result.
        bcrypt.compare( creds.pass, user.password, function(err, same) {
            if (err) throw err;

            req.session.authenticated = user._id;

            return res.send( {
            "success" : same, 
            "message" : same ? 'Welcome back, ' + user.username + '!'
            : 'Sorry, that password does not match that username.'
            });
        });
    });
};


Users.prototype.logout = function ( req, res ) {
    if ( ! req.session.authenticated ) return res.send( {"message" : this.noUserMessage, "success" : false} );

    req.session.authenticated = null;
    res.clearCookie( 'authenticated' );
    req.session.destroy( function( ) { } );
    return res.send( {"message" : this.logoutMessage, "success" : true} );
};


Users.prototype.addUser = function (req, res) {

    var pass =  req.body.password;
    var username = req.body.username;

    this.model.addUser( username, pass, ( function( err, result ) {
        if ( err ) { 
            return res.send( {
                "message" : "Sorry, there was a problem registering you.",
                "success" : false
            });
        }

        var response  =  {};
        if ( result.duplicate ) {
             response.message = this.userAlreadyExistsMessage;
        }
        else {
            response.message = this.userAddedMessage; 
            response.success = true;
            response.user = result[0];
            req.session.authenticated  =  result[0]._id;
        }

        return res.send( response );
    }).bind( this ) );
};

Users.prototype.getHotStops = function( req, res ) {
    var userId = req.session.authenticated;

    if (! userId ) return res.send({"message": "You must log in to view stops."});

    this.model.getStops( userId, function( err, result ) {
        if ( err ) res.send({"error" : err});

        res.send({
            "success" : true,
            "HotStops" : result[0].HotStops
        });
    });
};

Users.prototype.removeHotStop = function ( req, res ) {
    var userId = req.session.authenticated;
    this.model.removeHotStop( userId, req.body, function( err, result ) {
        console.log(result);
        if ( err ) return res.send({"error" : err});

        if ( result.length < 1 ) return res.send({"message" : "Update failed"});

        return res.send({"message" : "Stop removed."});
    });
};

module.exports = Users;
