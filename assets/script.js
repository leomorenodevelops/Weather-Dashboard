// Array for holding the users search history
var searchHistory = []
var lastCitySearch = ""

// API call to openweathermap.org
var cityWeather = function(city) {
    var geoLocation = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=33a442ce0b1dad52f9352616c57d9d69"
    fetch(geoLocation)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data);
        getoneCall(data, city);
    })
};
function getoneCall(data, city) {
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data[0].lat + "&lon=" + data[0].lon + "&appid=33a442ce0b1dad52f9352616c57d9d69&units=imperial"
    fetch(oneCall)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data);
        displayWeather(data, city);
        displayFiveDay(data, city);
    })
}
// Function for city search form submit
var citySearch = function(event) {
    event.preventDefault();

    // Get value from cityname id element
    var cityName = $("#cityname").val().trim()
    
    // sends value to cityWeather function
    if (cityName) {
        cityWeather(cityName);

        // Clears search input
        $("#cityname").val("");

        // Sends alert if nothing was inputed
    } else {
        alert("Enter a city name");
    }
};

// Function to display the data from openweathermap.org to main weather card
var displayWeather = function(weatherData, city) {
    $("#main-city-name").text(`${city} (${moment.unix(weatherData.current.dt).format("MM-DD-YYYY")})`);
    var img = $("<img>")
    img.attr("src", "https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png")
    $("#main-city-name").append(img);
    $("#main-city-temp").text(`Temp: ${weatherData.current.temp}` + "°F");
    $("#main-city-humid").text(`Humidity: ${weatherData.current.humidity}` + "%");
    $("#main-city-wind").text(`Wind Speed: ${weatherData.current.wind_speed}` + " mph");
    $("#uv-box").text(`${weatherData.current.uvi}`);

    // Highlights the UV Index value
if (weatherData.current.uvi >= 11) {
    $("#uv-box").css("background-color", "purple")
    } else if (weatherData.current.uvi < 11 && weatherData.current.uvi >= 8) {
    $("#uv-box").css("background-color", "red")
    } else if (weatherData.current.uvi < 8 && weatherData.current.uvi >= 6) {
    $("#uv-box").css("background-color", "orange")
    } else if (weatherData.current.uvi < 6 && weatherData.current.uvi >= 3) {
        $("#uv-box").css("background-color", "yellow")
    } else {
        $("#uv-box").css("background-color", "green")
    }
}

// Inserts weather data into 5 day forecast cards
var displayFiveDay = function(weatherData, city) {
    
    // Clears previous 5 day weather data card entries
    $("#five-day").empty();
    
    for (var i=0; i < 5; i++) {
    var fiveDayCard = $("<div class='card mt-2 text-white bg-primary'></div>");
    var fiveDayBody = $("<div class='card-body'></div>");
    var date = $("<h6 class='card-title'></h6>");
    date.text(moment.unix(weatherData.daily[i].dt).format("MM-DD-YYYY"));
    var icon = $(`<img src='https://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}.png'>`)
    var fiveDayTemp = $(`<p class='card-text'>Temp: ${weatherData.hourly[i].temp} °F</p>`);
    var fiveDayWind = $(`<p class='card-text'>Wind: ${weatherData.daily[i].wind_speed} MPH</p>`);
    var fiveDayHumid = $(`<p class='card-text'>Humidity: ${weatherData.daily[i].humidity} %</p>`);
    $("#five-day").append(fiveDayCard);
    fiveDayCard.append(fiveDayBody);
    fiveDayBody.append(date, icon, fiveDayTemp, fiveDayWind, fiveDayHumid);
    }

// Saves the last city searched
lastCitySearch = city;

// Saves to the search history using weatherdata.name API value
saveSearchHistory(city);
}

// Function to save the search history to local storage
var saveSearchHistory = function(city) {

        var searchedCity = $(`<a href='#' class='list-group-item list-group-item-action' id='${city}'>${city}</a>`);
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        $("#search-history").append(searchedCity);
    }

    // Saves searchHistory array to local storage
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    // Saves lastCitySearch to local storage
    localStorage.setItem("lastCitySearch", JSON.stringify(lastCitySearch));

    // Displays searchHistory array
    loadSearchHistory();
}

// Function to load saved city search history from local storage
var loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastCitySearch = JSON.parse(localStorage.getItem("lastCitySearch"));

    // If local storage is empty condition creates an empty searchHistory array and a empty lastCitySearch string
    if (!searchHistory) {
        searchHistory = [];
    }

    if (!lastCitySearch) {
        lastCitySearch = "";
    }

    // Clears previous values from #search-history ul
    $("#search-history").empty();

    // For loop will run through all cities found in the array
    for (var i=0; i < searchHistory.length; i++) {

        // Adds city as a link also sets id and appends to the #search-history ul
        var searchedCityLink = $(`<a href='#' class='list-group-item list-group-item-action' id='${searchHistory[i]}'>${searchHistory[i]}</a>`)
        $("#search-history").append(searchedCityLink);
    }
}

// Loads search history from local storage
   loadSearchHistory();

// Page starts up with the last city searched if there is a saved city
if (lastCitySearch != "") {
    cityWeather(lastCitySearch);
}

// Searches city weather when search button is clicked
$("#search").on("click", citySearch);
$("#search-history").on("click", function(event) {

    // Gets the link id value
    var prevCity = $(event.target).closest("a").attr("id");

    // Passes id value to the cityWeather function
    cityWeather(prevCity);
});