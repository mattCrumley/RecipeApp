require('dotenv').config(); //tells server to load anything in a dotenv into environment variable
//console.log(process.env);  //show environment variables (where API key stored)
var express = require("express");
var router = express.Router();
var passport = require("passport")
var unirest = require("unirest");
var Recipe = require("../models/recipe")
var User = require("../models/user")
var middleware = require("../middleware")





//***********************Recipe routes********************

//INDEX RESTful route. when user goes to /recipes", render recipes.ejs. 
router.get("/recipes", function(req, res){
	//get all recipes from DB
	Recipe.find({}, function(err, recipes){
		if(err){
			console.log("The was an error");
		}
		else{
			res.render("recipes/index", {recipes:recipes, currentUser: req.user});
		}
	});
	
	
});

//when the user goes to /recipes/new, render new.ejs which is a form to submit a new recipe
//NEW RESTful route
router.get("/recipes/new", middleware.isLoggedIn, function(req, res){
	res.render("recipes/new");
	
});

/* In new.ejs, there is a form that submits a post request
	this handles the post request and adds a new recipe to the page
*/
//CREATE RESTful route
router.post("/recipes", middleware.isLoggedIn, function(req, res){
	
	var apiReq = unirest("GET", "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract");

	apiReq.query({
		"url": req.body.Link
	});

	apiReq.headers({
		"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
		"x-rapidapi-key": process.env.API_KEY
	});

	apiReq.end(function (apiRes) {
		if (apiRes.error){
			console.log(apiRes.error);
			res.redirect("/recipes");
		} 
		var ingredients ="";
		var instructions ="";
		for(i = 0; i < apiRes.body.extendedIngredients.length; i++){
			ingredients += apiRes.body.extendedIngredients[i].originalString + "\n"
		}
		for(var i = 0; i < apiRes.body.analyzedInstructions[0].steps.length; i++ ){
			instructions += apiRes.body.analyzedInstructions[0].steps[i].number.toString(10) +". "
			instructions += apiRes.body.analyzedInstructions[0].steps[i].step +"\n"+"\n"
		}
	
		var name = apiRes.body.title;
		var image = apiRes.body.image;
		var rating = req.body.rating;
		var cost = apiRes.body.totalCost;
		var Link = req.body.Link;
		var author = {
			id: req.user._id,
			username: req.user.username
		}
		var newRecipe= {name: name, ingredients: ingredients, instructions: instructions, image: image, rating: rating, cost: cost, Link: Link, author: author};

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
	
	
	
});

//EDIT route
router.get("/recipes/:id/edit", middleware.checkRecipeOwnership, function(req, res){
	
	Recipe.findById(req.params.id, function(err, foundRecipe){
		res.render("recipes/edit", {recipe: foundRecipe})
		
		
	});


})

//UPDATE route
router.put("/recipes/:id", middleware.checkRecipeOwnership, function(req, res){
	// find and update recipe
	Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
		if(err){
			res.redirect("/recipes")
		}
		else{
			res.redirect("/recipes/" +req.params.id);
		}
	})
	//redirect
	
})

//SHOW RESTful route
router.get("/recipes/:id", function(req,res){
	/*find the recipe with provided ID
	  1) Find a recipe by id, 2) populating comments on a recipe, 3) executing 
	*/
	Recipe.findById(req.params.id).populate("comments").exec( function(err, foundRecipe){
		if(err){
			console.log("There was an error");
		}
		else{
			//render show template with that recipe
			res.render("recipes/show",{recipe: foundRecipe});
		}
	});
	
});

//DESTROY RESTful route
router.delete("/recipes/:id", middleware.checkRecipeOwnership, function(req, res){
	Recipe.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/recipes")
		}
		else{
			res.redirect("/recipes")
		}
	})
})


module.exports = router;