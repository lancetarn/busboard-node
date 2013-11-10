var mongo = require('mongodb');
var q = require('q');
var mongoClient = mongo.MongoClient;
var broker;

mongoClient.connect('mongodb://localhost/busboard?w=1&auto_reconnect=true', function(err, db) {
    if (err) {
        console.log("Failed connecting to 'busboard' db");
    }
    else {
        broker = db;
    }

});

module.exports = {

   insert : function( collName, doc, callback ) {
     var collection = broker.collection(collName);
     collection.insert(doc, function(err, docs) {
        if (err) return callback(err);

        callback(null, docs);
        
     } );
   },

   find : function( collName, query, callback ) {
     var collection = broker.collection(collName);
     collection.find(query).toArray( function(err, result) {
        if (err) return callback(err);
        
        callback(null, result);
     } );
   }

};
