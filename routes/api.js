/*
 * Serve JSON to our AngularJS client
 */
var mongoBroker = require( '../mongoBroker' );
var UserModel = require( '../userModel' );
var UserAPI = require( '../users' );
exports.userapi = new UserAPI( new UserModel( mongoBroker ) );
