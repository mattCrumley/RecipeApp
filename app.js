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

var commentRoutes = require("./routes/comments");
var recipeRoutes = require("./routes/recipes");
var indexRoutes = require("./routes/index");

var methodOverride = require("method-override")
var flash = require("connect-flash")

//seedDB(); //seed database



// Passport configuration
app.use(require("express-session")({
	secret: "password",
	resave: false,
	saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ //calls this function on every route
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //tells express where public assets are (like frontend .css, .js, images, etc.)

//connect to mongo db database
mongoose.connect("mongodb://localhost/recipeApp", { useNewUrlParser: true });

app.use(indexRoutes);
app.use(commentRoutes);
app.use(recipeRoutes);


//start server. 3000 because that is the port goorm ide uses
app.listen(3000, function(){
	console.log("The recipeApp server has started");
});
