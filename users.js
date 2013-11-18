
var bcrypt = require('bcrypt');
    
function UserAPI( UserModel ) {
    this.model = UserModel;
    this.noUserMessage = "No user found.";
    this.noStopMessage = "Invalid stop received.";
}

UserAPI.prototype.addStop = function (req, res) {
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

UserAPI.prototype.login = function (req, res) {
    if ( req.session.authenticated ) res.send({"message" : "Already logged in.", "success" : false});

    console.log( "In function: ",this.model );
    
    var creds = this.model.getCredsFromReq(req);
    
    this.model.getByName( creds.user, function(err, result) {
        if (err) throw err;

        if ( result.length > 1 ) throw new Error( 'Found non-unique username: ' + creds.user );
        
        if ( result.length === 0 ) {
            return res.send( {"message" : 'User not found.', "success" : false} );
        }

        var user = result[0];

        bcrypt.compare( creds.pass, user.password, function(err, same) {
            if (err) throw err;

            req.session.authenticated = user._id;

            return res.send( {
            "success" : same, 
            "message" : same ? 'Welcome back, ' + user.username + '!'
            : 'Sorry, that password does not match that username.'
            } );
        } );
    } );
};

UserAPI.prototype.addUser = function (req, res) {

    var pass =  req.body.password,
        username = req.body.username;

    mongoBroker.find( 'user', {"username" : username}, undefined, function(err, result) {
        if (err) throw err;

        if ( result.length > 0 ) return res.send({
            "message" : "Sorry, that username is already in use.",
            "success" : false
            });

        bcrypt.hash( req.body.password, 5, function(err, hash) {
            if (err) throw err;

            var user = { 
                'username' : username,
                'password' : hash,
                'joined' : new Date(),
                'modified' : new Date(),
                'HotStops' : []
            };

            mongoBroker.insert('user', user, function(err, result) {
                if (err) res.send({'error' : err});

                console.log("Added user '" + user.username +"'");
                res.send({"success" : true});
                
            });
        });
    });
};

UserAPI.prototype.getHotStops = function( req, res ) {
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

UserAPI.prototype.removeHotStop = function ( req, res ) {
    var userId = req.session.authenticated;
    this.model.removeHotStop( userId, req.body, function( err, result ) {
        console.log(result);
        if ( err ) return res.send({"error" : err});

        if ( result.length < 1 ) return res.send({"message" : "Update failed"});

        return res.send({"message" : "Stop removed."});
    });
};

module.exports = UserAPI;
