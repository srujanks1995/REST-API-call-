
$(document).ready(function() {
  // add an event listener (performSearch) to the form
  $("#query-form").submit(function(event) { performSearch(event); });
});


function isADefunctSite(sampleSite) {

  var found = false;

  defunctDomains.forEach(
    function (item, index) {
      if (sampleSite.includes(item)) { found = true; }
    }
  );

  return found;

}

// This function turns the results that is returned into HTML elements
// to display on the web page

function formatSearchResults(jsonResults) {

  var jsonObject = jsonResults;
  var siteCount = 0;

  if (jsonObject.weather.length == 0) {
    setNotFoundMessages();
  }
  else {

    $("#search-results-heading").text("Search Results");
    var formatedText = "";
    formatedText += "<div class='dish-Latitude-div'>City: " + jsonObject.name + "</div>";
    jsonObject.weather.forEach(
      function(item, index) {

      

        siteCount++;
        formatedText += "<div class='dish-Latitude-div'> Weather: " + item.main + "</div>";
      }
    );

    if (siteCount > 0) {
      $("#results").html(formatedText);
    }
    else {
      setNotFoundMessages();
    }
  }

}

// This functions handles sending off the search request as well as
// error and success handling when the request calls back

function performSearch(event) {

  // Variable to hold request
  var request;

  // Prevent default posting of form - put here to work in case of errors
  event.preventDefault();

  // Abort any pending request
  if (request) {
      request.abort();
  }
  // setup some local variables
  var $form = $(this);

  // disable the inputs and buttons for the duration of the request.
  setFormDisabledProps(true);

  $("#search-results-heading").text("Searching ...");
  $("#results").text("");

  // Send the request

  request = $.ajax({
      url: "https://fcc-weather-api.glitch.me/api/current",
      type: "GET",
      data: { lat: $("#Latitude").val(), lon: $("#Longitude").val()}
  });

  // Callback handler for success

  request.done(function (response, textStatus, jqXHR){
      console.log(response)
     formatSearchResults(response);
      //$("#results").html("<p>"+response+"</p>")
  });

  // Callback handler for failure

  request.fail(function (jqXHR, textStatus, errorThrown){
      $("#search-results-heading").text("An error occurred. Please try again.");
      $("#results").text("");
  });

  // Callback handler that will be called in any case

  request.always(function () {
      // Reenable the inputs
      setFormDisabledProps(false);
  });

}

// This function clears the search results and the heading "Search Results"

function resetResults() {
  $("#search-results-heading").text("");
  $("#results").text("");
}

function setFormDisabledProps(statusToSet) {
    document.getElementById("Latitude").disabled = statusToSet;
    document.getElementById("Longitude").disabled = statusToSet;
    document.getElementById("resetButton").disabled = statusToSet;
    document.getElementById("searchButton").disabled = statusToSet;
}

// This function sets the result heading to "no recipes found" and clear the
// existing search results, if there are any

function setNotFoundMessages() {
  $("#search-results-heading").text("please change search criteria.");
  $("#results").text("");
}
