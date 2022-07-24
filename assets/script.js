// Array for holding the users search history
var searchHistory = []
var prevCitySearched = ""

// API call to openweathermap.org
var cityWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=33a442ce0b1dad52f9352616c57d9d69&units=imperial";
    
}