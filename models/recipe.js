var mongoose = require("mongoose");

/*
mongo db schema setup. Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
*/
var recipeSchema= new mongoose.Schema({
	name: String,
	image: String,
	rating: Number,
	ingredients:String,
	instructions: String,
	cost: Number,
	Link: String,
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

/*
When you call mongoose.model() on a schema, Mongoose compiles a model for you. This variable will ALWAYS be singular.

When recipe.js is used (via require()) in another file, the user will be getting the Recipe model
*/
module.exports = mongoose.model("Recipe", recipeSchema);