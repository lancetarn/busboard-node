var config = require( './settings' );
var mongo = require('mongodb');
var q = require('q');
var mongoClient = mongo.MongoClient;
var broker;

mongoClient.connect('mongodb://' + config.db_config.host + '/' + config.db_config.name + '?w=1&auto_reconnect=true', function(err, db) {
    if (err) {
        console.log("Failed connecting to " + config.db_config.name + " db");
    }
    else {
        broker = db;
    }

});

module.exports = {

   makeId : function( idString ) {
       return new mongo.ObjectID(idString);
   },

   update : function( collName, query, doc, options, callback ) {
       var collection = broker.collection(collName);
       collection.update(query, doc, options, function(err, count) {
           if (err) return callback(err);

           callback(null, count);
       });
   },

   insert : function( collName, doc, callback ) {
     var collection = broker.collection(collName);
     collection.insert(doc, function(err, docs) {
        if (err) return callback(err);

        callback(null, docs);
        
     } );
   },

   find : function( collName, query, fields, callback ) {
        console.log( collName );
     var collection = broker.collection(collName);
     console.log( collection );
     collection.find(query, fields).toArray( function(err, result) {
        if (err) return callback(err);
        
        callback(null, result);
     } );
   }

};
