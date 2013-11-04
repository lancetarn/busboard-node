/*
 * Serve JSON to our AngularJS client
 */
var mongoBroker = require('../mongobroker');
var bcrypt = require('bcrypt');
    
exports.authenticate = function (req, res) { };

exports.addUser = function (req, res) {

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
};
