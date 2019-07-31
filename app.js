var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");
app.use(express.static("public")); //tells express where public assets are (like frontend .css, .js, images, etc.)

//connect to mongo db database
mongoose.connect("mongodb://localhost/recipeApp", { useNewUrlParser: true });

/*
mongo db schema setup. Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
*/
var recipeSchema= new mongoose.Schema({
	name: String,
	image: String,
	rating: Number,
	cost: Number,
	Link: String
});

/*
When you call mongoose.model() on a schema, Mongoose compiles a model for you. This variable will ALWAYS be singular
*/
var Recipe = mongoose.model("Recipe", recipeSchema);

//when user goes to homepage, render landing.ejs
app.get("/", function(req, res){
	res.render("landing");
});




//INDEX RESTful route. when user goes to /recipes", render recipes.ejs. 
app.get("/recipes", function(req, res){
	//get all recipes from DB
	Recipe.find({}, function(err, recipes){
		if(err){
			console.log("The was an error");
		}
		else{
			res.render("index", {recipes:recipes});
		}
	});
	
	
});

//when the user goes to /recipes/new, render new.ejs which is a form to submit a new recipe
//NEW RESTful route
app.get("/recipes/new", function(req, res){
	res.render("new.ejs");
	
});

/* In new.ejs, there is a form that submits a post request
	this handles the post request and adds a new recipe to the page
*/
//CREATE RESTful route
app.post("/recipes", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var rating = req.body.rating;
	var cost = req.body.cost;
	var Link = req.body.Link;
	var newRecipe= {name: name, image: image, rating: rating, cost: cost, Link: Link};
	
	//create a new recipe and save to db
	Recipe.create(newRecipe, function(err, newlyCreated){
		if(err){
			console.log("There was an error");
		}
		else{
			//redirect back to recipe page
			res.redirect("/recipes");
		}
	});
	
});

//SHOW RESTful route
app.get("/recipes/:id", function(req,res){
	//find the recipe with provided ID
	Recipe.findById(req.params.id, function(err, foundRecipe){
		if(err){
			console.log("There was an error");
		}
		else{
			//render show template with that recipe
			res.render("show",{recipe: foundRecipe});
		}
	});
	
});


//start server. 3000 because that is the port goorm ide uses
app.listen(3000, function(){
	console.log("The recipeApp server has started");
});
