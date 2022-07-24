// Array for holding the users search history
var searchHistory = []
var prevCitySearched = ""

// API call to openweathermap.org
var cityWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=33a442ce0b1dad52f9352616c57d9d69&units=imperial";
    
    // URL request
    fetch(apiUrl)
    .then(function(response) {
        
        // If request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data);
            });

            // If request fails
        } else {
            alert("Error: " + response.statusText);
        }
    })

    // Sends alert if no response from open weather
    .catch(function(error) {
        alert("Unable to connect to openweathermap.org");
    })
};

// Function for city search form submit
var citySearch = function(event) {
    event.preventDefault();
}