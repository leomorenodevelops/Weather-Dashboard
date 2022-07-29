// Array for holding the users search history
var searchHistory = []
var prevCitySearched = ""

// API call to openweathermap.org
var cityWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=33a442ce0b1dad52f9352616c57d9d69&units=imperial";
    var geoLocation = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=33a442ce0b1dad52f9352616c57d9d69"
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
        displayFiveDay(data);
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
    img.attr("src", "http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png")
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
        $("#uv-box").css("backgrounnd-color", "yellow")
    } else {
        $("#uv-box").css("background-color", "green")
    }
}

var displayFiveDay = function(weatherData) {
    for (var i=1; i < 6; i++) {
    var date = $("<h6>");
    date.text(moment.unix(weatherData.daily[i].dt).format("MM-DD-YYYY"));
    $("#five-day").append(date);
    }
}

// Searches city weather when search button is clicked
$("#search").on("click", citySearch);