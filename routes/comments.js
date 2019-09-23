var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe")
var Comment = require("../models/comment")
var middleware = require("../middleware")



//***********************comments routes***********************

/*
NEW RESTful route. isLoggedIn checks to make sure user is logged in before 
making comment
*/
router.get("/recipes/:id/comments/new", middleware.isLoggedIn, function(req, res){
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
router.post("/recipes/:id/comments", middleware.isLoggedIn, function(req, res){
	//lookup recipe using ID
	Recipe.findById(req.params.id, function(err, recipe){ //find the correct recipe
		if(err){
			console.log(err);
			res.redirect("/recipes");
		}
		else{
			console.log(req.body.comment);
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong.")
					console.log(err);
				}
				else{
					comment.author.id = req.user.id; //add username and id to comment
					comment.author.username = req.user.username;
					comment.save();
					recipe.comments.push(comment); //add the new comment to the recipe
					recipe.save();
					req.flash("success", "Sucessfully added comment.")
					res.redirect("/recipes/" + recipe._id);
				}
				
			});

		}
		
	});
	

});

//EDIT route
router.get("/recipes/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {recipe_id: req.params.id, comment:foundComment});
		}
	});
	
	
});

//Update route
router.put("/recipes/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back")
		}
		else{
			res.redirect("/recipes/" + req.params.id);
		}
		
	});
	
});

//DESTROY route
router.delete("/recipes/:id/comments/:comment_id", middleware.checkCommentOwnership,  function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment deleted.")
			res.redirect("/recipes/" + req.params.id);
		}
	})
});

function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router; 