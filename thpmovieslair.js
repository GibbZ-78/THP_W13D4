


// given a JSON object containing a list of movies data, display the related content within the "displayZone" section
function showMovies(myJSONList, myResultsCount) {
  let myDisplayZoneTmp = "";
  myDisplayZoneTmp += "<div class='col-11 d-flex m-2 p-2 border border-1 border-primary rounded'>";
  myDisplayZoneTmp += "<p class='display-5 fst-italic'>" + myResultsCount + " movies in database</p>";
  myDisplayZoneTmp += "</div>";
  myJSONList.forEach(element => {
    myDisplayZoneTmp += "<div class='col-11 d-flex m-2 p-2 border border-1 border-primary rounded'>";
    myDisplayZoneTmp += "<div class='col-3 pe-2'>";
    myDisplayZoneTmp += "<img src='" + element.Poster + "' class='img-fluid rounded' />";
    myDisplayZoneTmp += "</div>";
    myDisplayZoneTmp += "<div class='col-9 ps-2'>";
    myDisplayZoneTmp += "<p class='display-6 fw-bold'>" + element.Title + " (" + element.Year + ")</p>";
    myDisplayZoneTmp += "<p class='fs-6 my-2'>IMDB #:" + element.imdbID + ")</p>";
    myDisplayZoneTmp += "<p class='fs-6 my-2'><a class='btn btn-success'>Read more...</a></p>";
    myDisplayZoneTmp += "</div>";
    myDisplayZoneTmp += "</div>";
  });
  myDisplayZone.innerHTML = myDisplayZoneTmp;
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
      console.log(myJSONResult);
      if (myJSONResult.Response == "True") {
        showMovies(myJSONResult.Search, myJSONResult.totalResults);
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
  myFormatParam = "r=json"
  myJSONResult = "";
  myAPIKeyParam = "apikey=" + myOMDBKey;
  mySearchZone = document.getElementById("searchZone");
  mySearchBox = document.getElementById("searchBox");
  mySearchButton = document.getElementById("searchButton");
  myDisplayZone = document.getElementById("displayZone");
  //mySearchBox.addEventListener("change", launchDataCollection);
  mySearchButton.addEventListener("click", launchDataCollection);
  myObserverOptions = {
    root: myDisplayZone,
    rootMargin: '0px',
    threshold: 1.0
  }
  //myObserver = new IntersectionObserver(callback, options);
}

// Instantiating global vars and launching the main method
let myOMDBKey, myBaseURL, myImgURL, myAPIKeyParam, myTypeParam, myFormatParam, myJSONResult;
let mySearchZone, mySearchBox, mySearchButton, myDisplayZone;
let myObserverOptions, myObserver;
main();

// End of code

