 var uploadRecipeButton = document.querySelector("#uploadRecipeButton");
 var createCustomRecipeButton = document.querySelector("#createCustomRecipeButton");
 var uploadRecipe = document.querySelector("#uploadRecipe");
 var createCustomRecipe = document.querySelector("#createCustomRecipe");
 uploadRecipe.style.display ="none"; 
 createCustomRecipe.style.display="none"; 

 uploadRecipeButton.addEventListener("click", function(){ 
	 if(uploadRecipe.style.display == "none"){ 
		 uploadRecipe.style.display ="block"; 
	 } else{ 
		 uploadRecipe.style.display ="none"; 
	 } 
 
 }); 

 createCustomRecipeButton.addEventListener("click", function(){ 
	 if(createCustomRecipe.style.display ="none"){ 
		 createCustomRecipe.style.display ="block"; 
	 }  else{ 
		 createCustomRecipe.style.display ="none"; 
	 } 
 
 }); 

