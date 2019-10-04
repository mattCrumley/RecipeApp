var Recipe = require("../models/recipe")
var Comment = require("../models/comment")

var middlewareObj = {};


middlewareObj.checkRecipeOwnership = function(req, res, next){//middleware that ensures user owns recipe
		//is user logged in
	if(req.isAuthenticated()){ //if user is logged in
		Recipe.findById(req.params.id, function(err, foundRecipe){
			if(err){
				req.flash("error", "Recipe was not found.")
				res.redirect("back");
			}
			else{
				if(!foundRecipe){ //if recipe not found
					req.flash("error", "Recipe not found");
					return res.redirect("back");
				}
				
				//does user own recipe? compare id of recipe to current logged in user id
				if(foundRecipe.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You can only do that if you have posted the recipe.")
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error", "You need to login in order to do that. If you do not have an account, click on the 'Sign Up' button.")
		res.redirect("/login");
	}
} 

middlewareObj.checkCommentOwnership = function(req, res, next){//middleware that ensures user owns comment
		//is user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back")
			}
			else{
				//does user own comment? compare id of comment to current logged in user id
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You do not have permission to do that.")
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error", "You need to login in order to do that. If you do not have an account, click on the 'Sign Up' button.")
		res.redirect("/login");
	}
} 

middlewareObj.isLoggedIn = function(req,res, next){ //middleware that ensures user is logged in
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to login in order to do that. If you do not have an account, click on the 'Sign Up' button.");
	res.redirect("/login");
}
	

module.exports = middlewareObj