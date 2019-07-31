**************Instructions*******************

1)Start the mongo DB database
	*In the linux command terminal type the following:
		./mongod
		*note: the user will not have permissions to start the mongo db database by default.
		 To add permissions for mongod, type the following into the linux command terminal:
			chmod a+x mongod
		*

2)Start the website server:
	*In the linux command terminal type the following:
		node app.js


************Notes*************************

1) Note about the following lines of code:

app.listen(3000, function(){
	console.log("The recipeApp server has started");
});

I used a cloud based ide called Goorm because it gives me a domain name to use. Goorm uses port 3000.