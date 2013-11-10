
var mongoBroker = require('./mongobroker');
var bcrypt = require('bcrypt');
    
exports.users = {
    getReqParams : function( req ) {
        this.user = req.body.username;
        this.pass = req.body.password;
    },

    authenticate : function (req, res) {
        this.getReqParams(req);
        
    },

    addUser : function (req, res) {

        var pass =  req.body.password,
            username = req.body.username;

        mongoBroker.find( 'user', {"username" : username}, function(err, result) {
            if (err) throw err;

            console.log( result );
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
                    'modified' : new Date()
                };

                mongoBroker.insert('user', user, function(err, result) {
                    if (err) res.send({'error' : err});

                    console.log("Added user '" + user.username +"'");
                    res.send({"success" : true});
                    
                });
            });
        });
    }
};

