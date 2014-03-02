var bcrypt = require( 'bcrypt' );
var collection = 'user';
var broker;

function UserModel ( mongoBroker ) {

    broker = mongoBroker;
}

UserModel.prototype.getCredsFromReq = function( req ) {
    return {
        user : req.body.username,
        pass : req.body.password
    };
};

UserModel.prototype.getByName = function( username, callback ) {
    broker.find( collection, {"username" : username}, {}, callback );
};

UserModel.prototype.addStop = function( userId, stop, callback ) {
    var Id = broker.makeId( userId );
    broker.update( collection, {"_id" : Id}, {$addToSet : {"HotStops" : stop}}, {}, callback );
};

UserModel.prototype.getStops = function( userId, callback ) {
    var Id = broker.makeId( userId );
    broker.find(collection, {"_id" : Id}, {"HotStops":1, "_id":0}, callback );
};

UserModel.prototype.removeHotStop = function( userId, stop, callback ) {
    console.log( 'Removing stop: ' + stop + ' from user: ' + userId );
    var Id = broker.makeId( userId );
    broker.update( collection, {"_id" : Id}, {$pull: {"HotStops" : stop}}, callback );
};

UserModel.prototype.addUser = function( username, password, callback ) {

    broker.find( 'user', {"username" : username}, {}, function(err, result) {
        if (err) throw err;

        if ( result.length > 0 ) callback( null, { "success" : false, "duplicate" : true });

        bcrypt.hash( password, 5, function(err, hash) {
            if (err) throw err;

            var user = { 
                'username' : username,
                'password' : hash,
                'joined' : new Date(),
                'modified' : new Date(),
                'HotStops' : []
            };

            broker.insert('user', user, callback );
        });
    });
};

module.exports = UserModel;
