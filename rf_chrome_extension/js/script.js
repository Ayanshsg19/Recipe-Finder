// Declaring the variables.
const recipeEl = $(".recipe-el");
const urlList = $(".url-list");
const delAllBtn = $(".delAll-btn");
const tabBtn = $(".tab-btn");
const copyAllBtn = $(".copyAll-btn");
const recipeBtn = $(".recipe-btn");
let listFromLocalStorage = JSON.parse(localStorage.getItem("recipeList"));
let recipeList = [];

// Retaining the recipeList on extension page across tabs.
if(listFromLocalStorage) {
	recipeList = listFromLocalStorage;
	if(recipeList.length) {
		tabBtn.css("width", "50%");
		delAllBtn.css("display", "block");
		copyAllBtn.css("display", "block");
		render(recipeList);
	}
}

//search bar placeholder change.
recipeEl.focus(() => {
	recipeEl.attr("placeholder", "");
}).blur(() => {
	recipeEl.attr("placeholder", "Enter recipe URL");
})

//SAVE URL button functionality.
recipeBtn.click((e) => {
	e.preventDefault();
	if(recipeEl.val() != "") {
		recipeList.push($(".recipe-el").val());
		recipeEl.val("");
		localStorage.setItem("recipeList", JSON.stringify(recipeList));
		recipeList = JSON.parse(localStorage.getItem("recipeList"));
		tabBtn.css("width", "50%");
		delAllBtn.css("display", "block");
		copyAllBtn.css("display", "block");
		render(recipeList);
	}
})

//saving url by pressing ENTER key.
recipeEl.keypress((e) => {
	if(e.which == 13) {
		if(recipeEl.val() != "") {
			recipeList.push($(".recipe-el").val());
			recipeEl.val("");
			localStorage.setItem("recipeList", JSON.stringify(recipeList));
			recipeList = JSON.parse(localStorage.getItem("recipeList"));
			tabBtn.css("width", "50%");
			delAllBtn.css("display", "block");
			copyAllBtn.css("display", "block");
			render(recipeList);
		}
	}
})

//Saving current tab on active webpage.
tabBtn.click(() => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  //Getting current tab with chrome tab API
		recipeList.push(tabs[0].url);
		localStorage.setItem("recipeList", JSON.stringify(recipeList));
		recipeList = JSON.parse(localStorage.getItem("recipeList"));
		tabBtn.css("width", "50%");
		delAllBtn.css("display", "block");
		copyAllBtn.css("display", "block");
		render(recipeList);
	})
})

//Event Listner for DELETE ALL button.
delAllBtn.click(() => {
	recipeList = [];
	tabBtn.css("width", "100%");
	delAllBtn.css("display", "none");
	copyAllBtn.css("display", "none");
	localStorage.removeItem("recipeList");
	render(recipeList);
})

// Event Listener for COPY ALL button
// The button copy the URLs to the clipboard.
copyAllBtn.click(() => {
	let allList = "";
	for(let i = 0; i < recipeList.length; i++) {
		allList += `${i+1}. ${recipeList[i]}  `;
	}
	navigator.clipboard.writeText(allList);
})

// RENDER THE HTML ON WEBPAGE
function render(list) {
	let recipeURL = "";
	for(let i = 0; i < list.length; i++) {
		recipeURL += `
			<div class="mb-2 row">
				<div class="col-1 num-btn">
					${i+1}
				</div>
				<div class="col-9">
					<div class="recipe-url">
						<a target="_blank" href="${list[i]}">
							${list[i]}
						</a>
					</div>
				</div>
				<div class="col-1 copy-btn">
					<a href="#" title="copy to clipboard">
						<i class="bi bi-clipboard-plus"></i>
					</a>
				</div>
				<div class="col-1 del-btn">
					<a href="#">
						<i class="bi bi-trash-fill"></i>
					</a>
				</div>
			</div>
		`
	}
	urlList.html(recipeURL);

	// Event Listener on individual DELETE button.
	Array.from($('.del-btn')).forEach((btn, i) => {
        btn.addEventListener("click", (e) => {
        	e.preventDefault();
        	recipeList.splice(i, 1);
			localStorage.setItem("recipeList", JSON.stringify(recipeList));
			recipeList = JSON.parse(localStorage.getItem("recipeList"));
			render(recipeList);
			if(!recipeList.length) {
				tabBtn.css("width", "100%");
				delAllBtn.css("display", "none");
				copyAllBtn.css("display", "none");
				localStorage.removeItem("recipeList");
				render(recipeList);
			}
        })
    })

	// Event Listener for individual COPY button.
	Array.from($(".copy-btn")).forEach((btn, i) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			navigator.clipboard.writeText(list[i]);
		})
	})
}