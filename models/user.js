var mongoose = require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
	username: String,
	passport: String
})

//give passport package functionality to UserSchema
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", UserSchema);