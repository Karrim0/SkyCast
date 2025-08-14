var currentCity = "cairo";
var elements = {
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    cityName: document.getElementById("cityName"),
    dayName: document.getElementById("dayName"),
    date: document.getElementById("date"),
    temperature: document.getElementById("temperature"),
    weatherIcon: document.getElementById("weatherIcon"),
    weatherText: document.getElementById("weatherText"),
    humidity: document.getElementById("humidity"),
    wind: document.getElementById("wind"),
    windDir: document.getElementById("windDir"),
    nextDayName: document.getElementById("nextDayName"),
    nextDayIcon: document.getElementById("nextDayIcon"),
    nextDayMax: document.getElementById("nextDayMax"),
    nextDayMin: document.getElementById("nextDayMin"),
    nextDayText: document.getElementById("nextDayText"),
    thirdDayName: document.getElementById("thirdDayName"),
    thirdDayIcon: document.getElementById("thirdDayIcon"),
    thirdDayMax: document.getElementById("thirdDayMax"),
    thirdDayMin: document.getElementById("thirdDayMin"),
    thirdDayText: document.getElementById("thirdDayText")
};
function getWeather(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=27e6a311a76c4172a8e20629241011&q=" +${city}+ "&days=3`)
        .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        updateTodayWeather(data);
        updateNextDays(data);
    })
    .catch(function(error) {
        console.log("Error fetching weather data:", error);
    });
}
function updateTodayWeather(data) {
    var dateObj = new Date(data.location.localtime);
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    elements.dayName.innerHTML = days[dateObj.getDay()];
    elements.date.innerHTML = dateObj.getDate() + " " + months[dateObj.getMonth()];
    elements.cityName.innerHTML = data.location.name;
    elements.temperature.innerHTML = data.current.temp_c + "<sup>°</sup>C";

    elements.weatherIcon.setAttribute("src",'https:'+ data.current.condition.icon);


    elements.weatherText.innerHTML = data.current.condition.text;
    elements.humidity.innerHTML = data.current.humidity + " %";
    elements.wind.innerHTML = data.current.wind_kph + " km/h";
    elements.windDir.innerHTML = data.current.wind_dir;
}
function updateNextDays(data) {
    var forecast = data.forecast.forecastday;
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var nextDate = new Date(forecast[1].date);
    elements.nextDayName.innerHTML = days[nextDate.getDay()];
    elements.nextDayIcon.setAttribute("src",'https:'+ forecast[1].day.condition.icon);
    elements.nextDayMax.innerHTML = forecast[1].day.maxtemp_c + "<sup>°</sup>";
    elements.nextDayMin.innerHTML = forecast[1].day.mintemp_c + "<sup>°</sup>";
    elements.nextDayText.innerHTML = forecast[1].day.condition.text;
    var thirdDate = new Date(forecast[2].date);
    elements.thirdDayName.innerHTML = days[thirdDate.getDay()];
    elements.thirdDayIcon.setAttribute("src",'https:'+ forecast[2].day.condition.icon);
    elements.thirdDayMax.innerHTML = forecast[2].day.maxtemp_c + "<sup>°</sup>";
    elements.thirdDayMin.innerHTML = forecast[2].day.mintemp_c + "<sup>°</sup>";
    elements.thirdDayText.innerHTML = forecast[2].day.condition.text;
    // Change background based on day or night
if (data.current.is_day === 0) {
    document.body.style.background = "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
} else {
    document.body.style.background = " linear-gradient(120deg, #2c3e50, #3498db)";
}
document.body.style.transition = "background 1s ease";
}
function initializeWeatherApp() {
    getWeather(currentCity);
    elements.searchBtn.addEventListener("click", function() {
    var inputCity = elements.searchInput.value.trim();
    if (inputCity !== "") {
        getWeather(inputCity);
    }
    });
}
// detect user location
function detectLocationAndSetCity() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;


        fetch(`https://api.weatherapi.com/v1/forecast.json?key=27e6a311a76c4172a8e20629241011&q=${lat},${lon}&days=3`)
        .then(res => res.json())
        .then(data => {
            currentCity = data.location.name;
            updateTodayWeather(data);
            updateNextDays(data);
        })
        .catch(err => console.log("Error fetching weather by location:", err));
        }, function() {
        getWeather(currentCity);
        });
    } else {
        getWeather(currentCity);
    }
}

detectLocationAndSetCity();
initializeWeatherApp();
