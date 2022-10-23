let searchIn = $(".search-input");
let searchBtn = $(".search-btn");
let finalBtn = $(".final-btn");
let delAll = $(".del-all");
let ingredientTile = $(".ingredient-tile");
let recipeTile = $(".recipe-tile");
let tab1 = $(".tab-1");
let tab2 = $(".tab-2");
let randomShuffle = $(".random-shuffle");
let ingredientList = [];

let eachIngreTile = "";
$.get("html-snippets/single-ingredient-tile.html", (data) => {
	eachIngreTile = data;
})

let eachRecipeTile = "";
$.get("html-snippets/single-recipe-tile.html", (data) => {
	eachRecipeTile = data;
})

let otherHTML = "";
$.get("html-snippets/other-info.html", (data) => {
	otherHTML = data;
})

let mainNutHTML = "";
$.get("html-snippets/main-nutrients.html", (data) => {
	mainNutHTML = data;
})

searchBtn.click((e) => {
	e.preventDefault();
	if(searchIn.val() != "") {
		ingredientList.push(searchIn.val());
		finalBtn.css("display", "block");
		delAll.css("display", "block");
		localStorage.setItem("ingredientList", JSON.stringify(ingredientList));
		searchIn.val("");
		ingredientList = JSON.parse(localStorage.getItem("ingredientList"));
		render(ingredientList);
	}
})

searchIn.keypress((e)=>{
	if(e.which === 13) {
		if(searchIn.val() != "") {
			ingredientList.push(searchIn.val());
			finalBtn.css("display", "block");
			delAll.css("display", "block");
			localStorage.setItem("ingredientList", JSON.stringify(ingredientList));
			searchIn.val("");
			ingredientList = JSON.parse(localStorage.getItem("ingredientList"));
			render(ingredientList);
		}
	}
})

finalBtn.click((e) => {
	e.preventDefault();
	let showLoading = `
		<div class="text-center loader">
			<img src="Bean-Eater.gif">
		</div>
	`;
	recipeTile.html(showLoading);
	let apiUrl = setRecipeApiUrl(ingredientList);
	sendUrlToApi(apiUrl);
})

delAll.click((e) => {
	e.preventDefault();
	ingredientList = [];
	localStorage.removeItem("ingredientList");
	recipeTile.html("");
	render(ingredientList);
	finalBtn.css("display", "none");
	delAll.css("display", "none");
})

randomShuffle.click((e) => {
	e.preventDefault();
	let max = data.hits.length;
	let j = Math.floor(Math.random()*max)+1;
	window.open(data.hits[j].recipe.url, '_blank');
})

insertProperty = (string, propName, propValue) => {
	var propToReplace = "{{" + propName + "}}";
	string = string.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
};

setRecipeApiUrl = (list) => {
	let baseUrl = "https://api.edamam.com/api/recipes/v2?type=public&app_id=0cca7d4b&app_key=2aa4f1305243d846293a88b8ab33ea3d&q=";
	for(let i = 0; i < list.length; i++) {
		baseUrl += `${list[i]}`;
		if(i != list.length-1) {
			baseUrl += "%20and%20";
		}
	}
	return baseUrl;
}

sendUrlToApi = (url) => {
	$.get(url, function(data, status) {
		window.data = data;
		if(status == "success") {
			rendDataApi(data);
		}
		else {
			alert("Some error occured. Try again.");
		}
	})
}

setIngredients = (ingredients) => {
	let ingreHTML = "<ul>";
	for(let i = 0; i < ingredients.length; i++) {
		ingreHTML += `
			<li> ${ingredients[i]} </li>
		`
	}
	ingreHTML += "</ul>"
	return ingreHTML;
}

setMainNutrients = (mainNut) => {
	let finalHtml = "<ul>";
	let html = mainNutHTML;
	html = insertProperty(html, "label", mainNut.FAT.label);
	html = insertProperty(html, "quantity", Math.round((mainNut.FAT.quantity)*10)/10);
	html = insertProperty(html, "unit", mainNut.FAT.unit);
	finalHtml += html;
	html = mainNutHTML;
	html = insertProperty(html, "label", mainNut.CHOCDF.label);
	html = insertProperty(html, "quantity", Math.round((mainNut.CHOCDF.quantity)*10)/10);
	html = insertProperty(html, "unit", mainNut.CHOCDF.unit);
	finalHtml += html;
	html = mainNutHTML;
	html = insertProperty(html, "label", mainNut.FIBTG.label);
	html = insertProperty(html, "quantity", Math.round((mainNut.FIBTG.quantity)*10)/10);
	html = insertProperty(html, "unit", mainNut.FIBTG.unit);
	finalHtml += html;
	finalHtml += "</ul>";
	return finalHtml;
}

setOtherInfo = (others) => {
	let html = otherHTML;
	html = insertProperty(html, "cuisine_type", others.cuisineType[0]);
	html = insertProperty(html, "meal_type", others.mealType[0]);
	html = insertProperty(html, "dish_type", others.dishType[0]);
	return html;
}

rendDataApi = (data) => {
	let apiData = "";
	let max = data.hits.length;
	for(let i = 0; i < 10; i++) {
		let j = Math.floor(Math.random()*max)+1;
		let html = eachRecipeTile;
		html = insertProperty(html, "recipe_url", data.hits[j].recipe.url);
		html = insertProperty(html, "recipe_image", data.hits[j].recipe.image);
		html = insertProperty(html, "recipe_label", data.hits[j].recipe.label);
		html = insertProperty(html, "setIngredientsLine", setIngredients(data.hits[j].recipe.ingredientLines));
		html = insertProperty(html, "recipe_yield", data.hits[j].recipe.yield);
		html = insertProperty(html, "recipe_calories", Math.round((data.hits[j].recipe.calories)*10)/10);
		html = insertProperty(html, "setMainNutrientsLine", setMainNutrients(data.hits[j].recipe.totalNutrients));
		html = insertProperty(html, "setOtherInfoLine", setOtherInfo(data.hits[j].recipe));
		apiData += html;
	}
	recipeTile.html(apiData);
}

tab1.click((e) => {
	e.preventDefault();
	$(".load-home-snippets").load("html-snippets/what-to-do.html");
})

tab2.click((e) => {
	e.preventDefault();
	$(".load-home-snippets").load("html-snippets/website-purpose.html");
})

render = (list) => {
	let singleIngreTile = "";
	for(let i = 0; i < list.length; i++) {
		singleIngreTile += insertProperty(eachIngreTile, "list_item", list[i]);
	}
	ingredientTile.html(singleIngreTile);

	Array.from($(".del-btn")).forEach((btn, i) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			ingredientList.splice(i, 1);
			localStorage.setItem("ingredientList", JSON.stringify(ingredientList));
			ingredientList = JSON.parse(localStorage.getItem("ingredientList"));
			render(ingredientList);
			if(ingredientList.length === 0) {
				finalBtn.css("display", "none");
				delAll.css("display", "none");
				localStorage.removeItem("ingredientList");
				recipeTile.html("");
			}
		})
	})
}