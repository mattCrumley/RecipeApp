**************Instructions*******************

1) If deploying locally on Goorm IDE:
	1a)Alter app.js so that the app is using mongoDb locally
	//connect to mongo db database. Use this when you are running locally
	mongoose.connect("mongodb://localhost/recipeApp", { useNewUrlParser: true });
	
	//start server. 3000 because that is the port goorm ide uses
	/*
	Use this when you are running locally
	app.listen(3000, function(){
		console.log("The recipeApp server has started");
	});
	*/
	
	1b) Start the mongo DB database
		*In the linux command terminal type the following:
			./mongod
			*note: the user will not have permissions to start the mongo db database by default.
			 To add permissions for mongod, type the following into the linux command terminal:
				chmod a+x mongod
			*

	1c)Start the website server:
		*In the linux command terminal where app.js is located, type the following:
			node app.js
			
	1d) Use the following URL to launch the app https://weddevbootcamp-itnyf.run.goorm.io
	
2) if deploying on heroku:
	2a) Make sure there is a package.json file in the app directory. If none exists, type:
		npm init
	    Keep hitting enter until you're back at the command line, then open package.json
	2b) Alter "scripts" so it looks like the following and save:
	
	"scripts": {
    		"test": "echo \"Error: no test specified\" && exit 1",
	 	"start": "node app.js"
  	},
	
	2c) Make the following alterations to app.js:
	//use this when you are running on Heroku
	app.listen(process.env.PORT, process.env.IP, function(){
		console.log("The recipeApp server has started");
	});
	
	mongoose.connect("mongodb+srv://usernamehere:passwordhere@cluster0-mqjuy.mongodb.net/test?retryWrites=true&w=majority")
	
	2d) If no .git directory exists, type the following into the app directory:
		git init
	2e) git add .
	    git commit -m "deployment commit"
	    heroku create      *if not done already
	    git push heroku master
	    
	2f) Use the heroku app URL to view the app
	    
	

************Notes*************************

1) Note about the following lines of code:

app.listen(3000, function(){
	console.log("The recipeApp server has started");
});

I used a cloud based ide called Goorm because it gives me a domain name to use. Goorm uses port 3000.
