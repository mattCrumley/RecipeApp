var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//./models/recipe refers to recipe.js. which contains the recipe Schema
var Recipe = require("./models/recipe");

var seedDB = require("./seeds");

seedDB(); //seed database
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");
app.use(express.static("public")); //tells express where public assets are (like frontend .css, .js, images, etc.)

//connect to mongo db database
mongoose.connect("mongodb://localhost/recipeApp", { useNewUrlParser: true });



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
	/*find the recipe with provided ID
	  1) Find a recipe by id, 2) populating comments on a recipe, 3) executing 
	*/
	Recipe.findById(req.params.id).populate("comments").exec( function(err, foundRecipe){
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
