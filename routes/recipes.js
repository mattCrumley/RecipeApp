var express = require("express");
var router = express.Router();
var passport = require("passport")
var Recipe = require("../models/recipe")
var User = require("../models/user")


function isLoggedIn(req,res, next){ //middleware that ensures user is logged in
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkRecipeOwnership(req, res, next){//middleware that ensures user owns recipe
		//is user logged in
	if(req.isAuthenticated()){
		Recipe.findById(req.params.id, function(err, foundRecipe){
			if(err){
				res.redirect("/recipes")
			}
			else{
				//does user own recipe? compare id of recipe to current logged in user id
				if(foundRecipe.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");
				}
			}
		})
	}
	else{
		res.redirect("back"); //take user to previous page
	}
} 


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
router.get("/recipes/new", isLoggedIn, function(req, res){
	res.render("recipes/new");
	
});

/* In new.ejs, there is a form that submits a post request
	this handles the post request and adds a new recipe to the page
*/
//CREATE RESTful route
router.post("/recipes", isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var rating = req.body.rating;
	var cost = req.body.cost;
	var Link = req.body.Link;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newRecipe= {name: name, image: image, rating: rating, cost: cost, Link: Link, author: author};
	
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

//EDIT route
router.get("/recipes/:id/edit", checkRecipeOwnership, function(req, res){
	
	Recipe.findById(req.params.id, function(err, foundRecipe){
		res.render("recipes/edit", {recipe: foundRecipe})
		
		
	});


})

//UPDATE route
router.put("/recipes/:id", checkRecipeOwnership, function(req, res){
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
router.delete("/recipes/:id", checkRecipeOwnership, function(req, res){
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