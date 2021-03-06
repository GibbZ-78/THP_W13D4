
// Hide the pop-up by switching CSS classes
function hidePopUp() {
  document.getElementById("myPopUpSection").classList.remove("d-flex");
  document.getElementById("myPopUpSection").classList.add("d-none");
}

// Display the movie pop-up by switching CSS classes
function showPopUp(myMovieItem) {
  //event.preventDefault();
  console.log(myMovieItem);
  document.getElementById("myPopUpSection").style.zIndex = "10";
  document.getElementById("myPopUpSection").style.position = "absolute";
  document.getElementById("myPopUpSection").style.left = "100px";
  document.getElementById("myPopUpSection").style.top = "50px";
  document.getElementById("myPopUpSection").classList.remove("d-none");
  document.getElementById("myPopUpSection").classList.add("d-flex");
  document.getElementById("myMovieTitle2").textContent = myMovieItem.Title;
  document.getElementById("myMoviePoster2").innerHTML = "<img class='img-fluid' src='" + myMovieItem.Poster + "' />";
  document.getElementById("myMovieReleaseDate").textContent = "Released on: " + myMovieItem.Released;
  document.getElementById("myMovieActorsList").textContent = "Actors: " + myMovieItem.Actors;
  document.getElementById("myMovieStory").textContent = "Synopsis:" + myMovieItem.Plot;
  document.getElementById("closeCross").addEventListener("click", hidePopUp);
}

// Add an eventListener on all "Read More" buttons
function activateReadMoreButtons() {
  myButtons = document.querySelectorAll(".read-more");
  myButtons.forEach(element => {
    element.addEventListener("click", (event) => { launchReadMoreCollection(element.dataset.imdbid) });
  });
}

// given a JSON object containing a list of movies data, display the related content within the "displayZone" section
function showMovies(myJSONList, myResultsCount) {
  let myDisplayZoneTmp = "";
  myDisplayZoneTmp += "<div class='col-11 d-flex align-item-center m-2 p-2 border border-1 border-primary rounded'>";
  myDisplayZoneTmp += "<p class='fs-4 fst-italic text-grey'>" + myResultsCount + " movies in database match your search. Here below is just a sample...</p>";
  myDisplayZoneTmp += "</div>";
  myJSONList.forEach(element => {
    myDisplayZoneTmp += "<div class='col-11 d-flex m-2 p-2 border border-1 border-primary rounded'>";
    myDisplayZoneTmp += "<div class='col-3 pe-2'>";
    if (element.Poster != "N/A") {
      myDisplayZoneTmp += "<img src='" + myLazyTemplate + "' class='img-fluid rounded lazy-image' data-src='" + element.Poster + "'/>";
    } else {
      myDisplayZoneTmp += "<img src='" + myLazyTemplate + "' class='img-fluid rounded lazy-image' data-src='" + myLazyTemplate + "'/>";
    }
    myDisplayZoneTmp += "</div>";
    myDisplayZoneTmp += "<div class='col-9 ps-2'>";
    myDisplayZoneTmp += "<p class='display-6 fw-bold'>" + element.Title + " (" + element.Year + ")</p>";
    myDisplayZoneTmp += "<p class='fs-6 my-2'>IMDB #:" + element.imdbID + ")</p>";
    myDisplayZoneTmp += "<p class='fs-6 my-2'><a class='btn btn-success read-more' data-imdbid='" + element.imdbID + "'>Read more...</a></p>";
    myDisplayZoneTmp += "</div>";
    myDisplayZoneTmp += "</div>";
  });
  myDisplayZone.innerHTML = myDisplayZoneTmp;
}

// Callback function used by the observer to switch 'myLazyImage' with actual movie image 'element.Poster'
function myLazyLoadingFunction(myTargets, observer) {
  myTargets.forEach((entry) => {
    if (entry.isIntersecting) {
      let lazyImage = entry.target;
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove("lazy-image");
      myObserver.unobserve(lazyImage);
    }
  });
}

// Instantiate and activate the lazy loading observer on each needed image
function activateObserver() {
  myObserver = new IntersectionObserver(myLazyLoadingFunction, myObserverOptions);
  myLazyImages = document.querySelectorAll(".lazy-image");
  myLazyImages.forEach(myTmpImage => {
    myObserver.observe(myTmpImage);
  });
}

// Queries the OMDB API another time to collect compelmentary data related to THE movie whose "Read more" button has been pressed
function launchReadMoreCollection(myMovieID) {
  let mySearchParam = "i=" + myMovieID;
  let myTmpSearchURL = myBaseURL + "?" + myAPIKeyParam + "&" + myFormatParam + "&" + mySearchParam;
  console.log("  > Query ran against OMDB : '" + myTmpSearchURL + "'.");
  fetch(myTmpSearchURL)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log("  > Looks like we received a valid response. See below: ");
      myMovieResult = response;
      if (myMovieResult.Response == "True") {
        showPopUp(myMovieResult)
      }
    })
    .catch((error) => {
      console.error('  > Response error:', error.message);
      myJSONResult = "";
    });
}

// Queries the OMDB API to collect data relating to movies matching the "searchBox" content (if any)
function launchDataCollection(event) {
  let mySearchParam = "s=" + mySearchBox.value;
  let myTmpSearchURL = myBaseURL + "?" + myAPIKeyParam + "&" + myFormatParam + "&" + mySearchParam;
  console.log("  > Query ran against OMDB : '" + myTmpSearchURL + "'.");
  fetch(myTmpSearchURL)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log("  > Looks like we received a valid response. See below: ");
      myJSONResult = response;
      if (myJSONResult.Response == "True") {
        showMovies(myJSONResult.Search, myJSONResult.totalResults);
        activateObserver();
        activateReadMoreButtons();
      }
    })
    .catch((error) => {
      console.error('  > Response error:', error.message);
      myJSONResult = "";
    });
}

// Main method, launching and arranging all others
function main() {
  myOMDBKey = apiKey;
  myBaseURL = "http://www.omdbapi.com/";
  myImgURL = "http://img.omdbapi.com/";
  myLazyTemplate = "./lazy_image.png";
  myFormatParam = "r=json"
  myJSONResult = "";
  myAPIKeyParam = "apikey=" + myOMDBKey;
  myHeader = document.getElementById("myRockHeader");
  mySearchZone = document.getElementById("searchZone");
  mySearchBox = document.getElementById("searchBox");
  mySearchButton = document.getElementById("searchButton");
  myDisplayZone = document.getElementById("displayZone");
  //mySearchBox.addEventListener("change", launchDataCollection);
  mySearchButton.addEventListener("click", launchDataCollection);
  myObserverOptions = {
    root: null, //myDisplayZone,
    rootMargin: '0px',
    threshold: 1
  }
}

// Instantiating global vars and launching the main method
let myOMDBKey, myBaseURL, myImgURL, myAPIKeyParam, myTypeParam, myFormatParam, myJSONResult;
let mySearchZone, mySearchBox, mySearchButton, myDisplayZone;
let myObserverOptions, myObserver, myLazyTemplate, myLazyImages;
let myMovieResult;
main();

// End of code