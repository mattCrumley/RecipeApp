var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe")
var Comment = require("../models/comment")

//***********************comments routes***********************

/*
NEW RESTful route. isLoggedIn checks to make sure user is logged in before 
making comment
*/
router.get("/recipes/:id/comments/new", isLoggedIn, function(req, res){
	//find recipe by id
	Recipe.findById(req.params.id, function(err, recipe){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {recipe:recipe});
		}
		
		
	});

});

//CREATE RESTful route
router.post("/recipes/:id/comments", isLoggedIn, function(req, res){
	//lookup recipe using ID
	Recipe.findById(req.params.id, function(err, recipe){
		if(err){
			console.log(err);
			res.redirect("/recipes");
		}
		else{
			console.log(req.body.comment);
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
					recipe.comments.push(comment);
					recipe.save();
					res.redirect("/recipes/" + recipe._id);
				}
				
			});

		}
		
	});
	

});

function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router; 