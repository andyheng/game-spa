//starts and adds event listeners where needed
function loadContent() {
  document.addEventListener("DOMContentLoaded", function() {
    const resultsContainer = document.querySelector(".results-wrapper");  
    populateWrapper(resultsContainer);
    addItemAndCreateDOMElement(resultsContainer);
    resultItemButtonHandler(resultsContainer);
    showFormOnClick();
    closeSidebar();
  })
}

// Makes a call to API
// Runs a function that generates all items and appends to page
function populateWrapper(container) {
  axios.get("/api/games")
    .then(res => {
      createGameList(res.data, container);
    })
    .catch(err => {
      console.log(err);
    })
}

  // Takes all the items from the API
  // Runs a forEach that creates and appends each item to the page
function createGameList(data, container) {
  data.forEach(item => {
    appendGeneratedEl(item, container);
  })
}

// Appends the generated item to the page
function appendGeneratedEl(data, container) {
  const generatedEl = generateResultItem(data);
  container.appendChild(generatedEl);
}

// Generates a database item into a div and returns the result
function generateResultItem(data) {
  const el = document.createElement("div");
  el.setAttribute("data-id", data._id);
  el.classList.add("results-item");
  const formattedDate = moment(data.created).format("MMM Do YY");
  const createInnerEl = 
  `
    <img src="${data.image}">
    <h4>${data.title}</h4>
    <p>Added: ${formattedDate}</p>
    <button class="btn item-del">delete me</button>
    <button class="btn item-show">show more info</button>
  `
  el.innerHTML = createInnerEl;
  return el;
}

// Click button to show form
function showFormOnClick() {
  document.querySelector(".form-btn-show").addEventListener("click", function() {
    document.querySelector(".form").classList.toggle("form-hide");
  })
}


// Add an item to the database
// And then create an element from that item, and append it to the page
function addItemAndCreateDOMElement(container) {
  document.querySelector(".form").addEventListener("submit", function(e) {
    e.preventDefault();
    //create an object with the form's inputs
    const gameTitle = document.querySelector("#form-title");
    const gameImg = document.querySelector("#form-img");
    const formObj = {
      title: gameTitle.value,
      image: gameImg.value
    }
    //POST request
    axios.post("/api/games", formObj)
      .then(res => {
        appendGeneratedEl(res.data, container);
        return generateResultItem(res.data); // Pass the item to the next promise
      })
      .then((created) => {
        const createdDOM = document.querySelector(`[data-id="${created.dataset.id}"]`);
        createdDOM.classList.add("animated", "fadeIn");
      })
      .catch(err => {
        console.log(err);
      })
      gameTitle.value = "";
      gameImg.value = "";
  })
}

// Add main button handler to container (event delegation)
function resultItemButtonHandler(container) {
  container.addEventListener("click", buttonHandler); //event obj is passed in by default
}

// Main Handler Function
function buttonHandler(el) {
  const btn = el.target; //gives us the buttons
  const parent = btn.parentNode; //gives us the div parent
  const url = `/api/games/${parent.dataset.id}`;
  showAndDelete(btn, parent, url);
}

//Handles both delete and show buttons
function showAndDelete(btn, parent, url) {
  if (btn.matches("button")) {
    //delete
    if (btn.classList.contains("item-del")) {
      deleteHandler(parent, url);
    //show
    } else if (btn.classList.contains("item-show")) {
      showHandler(parent, url);
    }
  }
}

// Handles the show button
function showHandler(parent, url) { //when the show button is clicked...
  const sidebar = document.querySelector(".sb");
  if (sidebar.classList.contains("sb-active")) { //if the sidebar is active...
    if (sidebar.dataset.id === parent.dataset.id) { // ..and the sidebar's dataset id equals the current div
      slideOutSidebar(sidebar);
    } else {
      removePrevSidebar();
      getShowItem(url); // if the sb is open and another div btn is clicked, generate sb data and fill the currently active sb
    }
  } else { // if the sb is not active...
    getShowItem(url); //generate the sb data
    sidebar.classList.replace("sb-hide", "sb-active"); // replace the hide with active to show
    sidebar.classList.add("animated", "slideInRight");
  }
}

// Clears the previous sidebar content
function removePrevSidebar() {
  const sidebarContent = document.querySelector(".sb-content");
  sidebarContent.parentNode.removeChild(sidebarContent);
  document.querySelector(".sb").removeAttribute("data-id");
}

// Makes a GET request to the database for the given item
// And runs a function that generates the sidebar content
function getShowItem(url) {
  axios.get(url)
    .then(res => {
      createSidebarContent(res.data);
    })
    .catch(err => {
      console.log(err);
    })
}

//Handles the delete button
function deleteHandler(parent, url) {
  const animationDuration = 500; // 0.5s
  axios.delete(url)
    .then(res => {
      console.log(res.data);
    })
    fadeOutOnDel(parent, setTimeout(function() { //fadeout the item to 0 opacity
      parent.parentNode.removeChild(parent); // remove the node from the DOM
    }, animationDuration)); // after the animation ends
}

//Fades item out on delete 
function fadeOutOnDel(parent) {
  if (parent.classList.contains("fadeIn")) { // this happens when we add a new item, snce we fade it in
    parent.classList.replace("fadeIn", "fadeOut");
  }
  parent.classList.add("animated", "fadeOut") //have to also add animated class as items directly from db don't get the animated class (no point)
}

// Generates the sidebar content
function createSidebarContent(data) {
  const sidebar = document.querySelector(".sb");
  sidebar.setAttribute("data-id", data._id);
  const el = document.createElement("div");
  el.classList.add("sb-content");
  const formattedDate = moment(data.created).format("MMM Do YY");
  el.innerHTML = `
    <button class="sb-close">X</button>
    <h3>${data.title}</h3>
    <img src="${data.image}">
    <p>Date created: ${formattedDate}</p>
  `
  sidebar.appendChild(el);
}

// closes sidebar
function closeSidebar() {
  const sidebar = document.querySelector(".sb");
  sidebar.addEventListener("click", function(e) {
    if (e.target.matches("button") && e.target.classList.contains("sb-close")) {
      slideOutSidebar(sidebar);
    }
  })
}

// Slides the sidebar out of the screen
function fadeThenReplace(sidebar) {
  sidebar.classList.replace("slideInRight", "slideOutRight");
}

//Cleans up class list, and removes previous sidebar content
function slideOutSidebar(sidebar) {
  fadeThenReplace(sidebar, setTimeout(function() {
    sidebar.classList.replace("sb-active", "sb-hide");
    sidebar.classList.remove("animated", "slideOutRight");
  }, 500), setTimeout(function() {
    removePrevSidebar()
  }, 500));
}

// Run script
loadContent();