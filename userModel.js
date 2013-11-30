var bcrypt = require( 'bcrypt' );
var collection = 'user';

function UserModel ( mongoBroker ) {

    this.broker = mongoBroker;
}

UserModel.prototype.getCredsFromReq = function( req ) {
    return {
        user : req.body.username,
        pass : req.body.password
    };
};

UserModel.prototype.getByName = function( username, callback ) {
    this.broker.find( collection, {"username" : username}, {}, callback );
};

UserModel.prototype.addStop = function( userId, stop, callback ) {
    var Id = this.broker.makeId( userId );
    this.broker.update( collection, {"_id" : Id}, {$addToSet : {"HotStops" : stop}}, {}, callback );
};

UserModel.prototype.getStops = function( userId, callback ) {
    var Id = this.broker.makeId( userId );
    this.broker.find(collection, {"_id" : Id}, {"HotStops":1, "_id":0}, callback );
};

UserModel.prototype.removeHotStop = function( userId, stop, callback ) {
    console.log( 'Removing stop: ' + stop + ' from user: ' + userId );
    var Id = this.broker.makeId( userId );
    this.broker.update( collection, {"_id" : Id}, {$pull: {"HotStops" : stop}}, callback );
};

UserModel.prototype.addUser = function( ) {

    this.model.broker.find( 'user', {"username" : username}, {}, function(err, result) {
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

            this.model.broker.insert('user', user, function(err, result) {});
        });
    });
};

module.exports = UserModel;
