var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//./models/recipe refers to recipe.js. which contains the recipe Schema
var Recipe = require("./models/recipe");
var seedDB = require("./seeds");
var Comment = require("./models/comment");

var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

seedDB(); //seed database

// Passport configuration
app.use(require("express-session")({
	secret: "password",
	resave: false,
	saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");
app.use(express.static("public")); //tells express where public assets are (like frontend .css, .js, images, etc.)

//connect to mongo db database
mongoose.connect("mongodb://localhost/recipeApp", { useNewUrlParser: true });


//when user goes to homepage, render landing.ejs
app.get("/", function(req, res){
	res.render("landing");
});

//***********************Recipe routes********************

//INDEX RESTful route. when user goes to /recipes", render recipes.ejs. 
app.get("/recipes", function(req, res){
	//get all recipes from DB
	Recipe.find({}, function(err, recipes){
		if(err){
			console.log("The was an error");
		}
		else{
			res.render("recipes/index", {recipes:recipes});
		}
	});
	
	
});

//when the user goes to /recipes/new, render new.ejs which is a form to submit a new recipe
//NEW RESTful route
app.get("/recipes/new", function(req, res){
	res.render("recipes/new");
	
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
			res.render("recipes/show",{recipe: foundRecipe});
		}
	});
	
});


//***********************comments routes***********************

/*
NEW RESTful route. isLoggedIn checks to make sure user is logged in before 
making comment
*/
app.get("/recipes/:id/comments/new", isLoggedIn, function(req, res){
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
app.post("/recipes/:id/comments", isLoggedIn, function(req, res){
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
	
	//create new comment
	
	
	//connect comment to recipe
	
	//redirect recipe show page
});

//AUTH RESTful route

//show register form
app.get("/register", function(req,res){
	res.render("register");
})

//handle signup logic
app.post("/register", function(req, res){
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/recipes")
		});
	});
})

//show login form
app.get("/login", function(req, res){
	res.render("login");
})

//handle login logic
app.post("/login", passport.authenticate("local", {successRedirect:"/recipes",
  failureRedirect:"/login"}), function(req,res){
	
})


//logout route
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/recipes")
})

function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//start server. 3000 because that is the port goorm ide uses
app.listen(3000, function(){
	console.log("The recipeApp server has started");
});
