var mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var Comment = require("./models/comment");


var data = [
	{name: "Turkey Bacon and Avocado Grilled Cheese",
	 image:"https://tidymom.net/blog/wp-content/uploads/2015/08/turkey-bacon-grilled-cheese-sandwich.jpg",
	 rating:4,
	 cost:10.70,
	 Link:"https://tidymom.net/2015/turkey-bacon-and-avocado-grilled-cheese/"
	},
	{name: "Butternut Black Bean Burgers",
	 image:"https://peasandcrayons.com/wp-content/uploads/2014/11/butternut-black-bean-burgers-homemade-veggie-burger-recipe-650x-0095xS.jpg",
	 rating:3,
	 cost:15.10,
	 Link:"https://peasandcrayons.com/2014/11/butternut-black-bean-burgers.html"
	},
	{name: "Chicken Tinga Tacos",
	 image:"https://pinchofyum.com/wp-content/uploads/Chicken-Tinga-Tacos-6.jpg",
	 rating:4.5,
	 cost:11.34,
	 Link:"https://pinchofyum.com/the-best-chicken-tinga-tacos"
	}
	
];

function seedDB(){
	
	//Remove all recipes
	Recipe.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed recipes");
		//add seed recipes
		data.forEach(function(seed){
			Recipe.create(seed, function(err, recipe){
				if(err){
					console.log(err);
				}
				else{
					console.log("added a recipe");
					//create comment
					Comment.create({text:"This is delicious!", 
								    author:"Matthew"
								   }, function(err, comment){
										if(err){
											console.log(err);
										}
										else{
											recipe.comments.push(comment);
											recipe.save();
											console.log("comment created");
										}
										
									  });
				}
			});

		});
	
	});

}



module.exports = seedDB;