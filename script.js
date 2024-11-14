// Define the API endpoints
const ipApiUrl = "https://api.ipify.org?format=json"; // First API to get public IP
const locationApiUrl = (ip) => `https://ipinfo.io/${ip}/json?token=a57ed7751ca619`; // Second API to get location
const weatherApiUrl = (lat, lon) => `https://api.weatherapi.com/v1/current.json?key=7d0f4f2e51a04c4393f50233241411&q=${lat},${lon}`; // Third API for weather
const alternateWeatherApiUrl = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=356575738cb1914a6dffe264bac5e469`; // Fourth API for alternate weather

// Function to perform all API calls in sequence
async function fetchAllData() {
    const apiResults = document.getElementById('apiResults');
    const userName = document.getElementById('userName').value; // Get the entered name

    if (!userName) {
        apiResults.innerHTML = "<p>Please enter your name.</p>";
        return;
    }

    // Show loading message while fetching data
    apiResults.innerHTML = `<p>Hello, ${userName}! Loading data...</p>`;
    
    try {
        // First API Call: Get public IP
        const ipResponse = await fetch(ipApiUrl);
        if (!ipResponse.ok) throw new Error(`IP API Error: ${ipResponse.status}`);
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        apiResults.innerHTML = `<p>Public IP Address: ${ip}</p>`;

        // Second API Call: Get location based on IP
        const locationResponse = await fetch(locationApiUrl(ip));
        if (!locationResponse.ok) throw new Error(`Location API Error: ${locationResponse.status}`);
        const locationData = await locationResponse.json();
        const [lat, lon] = locationData.loc.split(",");
        apiResults.innerHTML += `<p>Location: ${locationData.city}, ${locationData.region}, ${locationData.country}</p>`;

        // Third API Call: Get weather at location
        const weatherResponse = await fetch(weatherApiUrl(lat, lon));
        if (!weatherResponse.ok) throw new Error(`Weather API Error: ${weatherResponse.status}`);
        const weatherData = await weatherResponse.json();
        apiResults.innerHTML += `<p>Weather: ${weatherData.current.condition.text}, ${weatherData.current.temp_c}°C</p>`;

        // Fourth API Call: Get alternate weather data
        const alternateWeatherResponse = await fetch(alternateWeatherApiUrl(lat, lon));
        if (!alternateWeatherResponse.ok) throw new Error(`Alternate Weather API Error: ${alternateWeatherResponse.status}`);
        const alternateWeatherData = await alternateWeatherResponse.json();
        const celsiusTemp = (alternateWeatherData.main.temp - 273.15).toFixed(2);
        apiResults.innerHTML += `<p>Alternate Weather: ${alternateWeatherData.weather[0].description}, ${celsiusTemp}°C</p>`;
        
    } catch (error) {
        apiResults.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        console.error("Detailed Error:", error); // Logs detailed error to the console for debugging
    }
}

// Ensure no function call on page load
// Remove the window.onload = fetchAllData; line from your script

