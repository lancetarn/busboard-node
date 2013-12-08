/*
 * Serve JSON to our AngularJS client
 */
var mongoBroker = require( '../mongobroker' );
var UserModel = require( '../userModel' );
var Users = require( '../users' );
exports.users = new Users( new UserModel( mongoBroker ) );
