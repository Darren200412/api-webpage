// Define the API endpoints
const ipApiUrl = "https://api.ipify.org?format=json"; // First API to get public IP
const locationApiUrl = (ip) => `https://ipinfo.io/${ip}/json?token=https://ipinfo.io/80.67.32.175/json?token=a57ed7751ca619`; // Second API to get location
const weatherApiUrl = (lat, lon) => `https://api.weatherapi.com/v1/current.json?key=7d0f4f2e51a04c4393f50233241411&q=${lat},${lon}`; // Third API for weather
const alternateWeatherApiUrl = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=356575738cb1914a6dffe264bac5e469`; // Fourth API for alternate weather

// Function to perform all API calls in sequence
async function fetchAllData() {
    const apiResults = document.getElementById('apiResults');
    apiResults.innerHTML = "<p>Loading...</p>";

    try {
        // First API Call: Get public IP
        const ipResponse = await fetch(ipApiUrl);
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        apiResults.innerHTML = `<p>Public IP Address: ${ip}</p>`;

        // Second API Call: Get location based on IP
        const locationResponse = await fetch(locationApiUrl(ip));
        const locationData = await locationResponse.json();
        const [lat, lon] = locationData.loc.split(",");
        apiResults.innerHTML += `<p>Location: ${locationData.city}, ${locationData.region}, ${locationData.country}</p>`;

        // Third API Call: Get weather at location based on latitude and longitude
        const weatherResponse = await fetch(weatherApiUrl(lat, lon));
        const weatherData = await weatherResponse.json();
        apiResults.innerHTML += `<p>Weather: ${weatherData.current.condition.text}, ${weatherData.current.temp_c}°C</p>`;

        // Fourth API Call: Get alternate weather data based on latitude and longitude
        const alternateWeatherResponse = await fetch(alternateWeatherApiUrl(lat, lon));
        const alternateWeatherData = await alternateWeatherResponse.json();
        apiResults.innerHTML += `<p>Alternate Weather: ${alternateWeatherData.weather[0].description}, ${alternateWeatherData.main.temp - 273.15}°C</p>`;
        
    } catch (error) {
        apiResults.innerHTML = `<p>Error fetching data: ${error}</p>`;
    }
}

// Call the function on page load
window.onload = fetchAllData;
