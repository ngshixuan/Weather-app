// JS CODE to deal with data, HTTP Request and API

//https://developer.accuweather.com/ --> register a free account

/*
when we generally use an API, they want us to create an app --> https://developer.accuweather.com/user/me/apps --> "add a new app"

check "create_app_example.png"

The idea  to create the app is to GET AN API KEY from the API service (accuweather)

This API KEY is when we make any HTTP request to their service, we can send this key, when it reaches their service, they know who made the request

Free trial - we can only open 1 account and have 15 request.day
*/

const key= "jCLPUDFqHDZV7369qCF3gfHGutmpcVKG";

/*
when we are requesting data from the ENDPOINTS in this API, we need to do 2 different things (for our project):

    (i) make a req to a certain endpoint to get CITY INFORMATION, in that city information, there's a city code
    (ii) we are going to use this CITY CODE to make another request to a weather condition API ENDPOINT

    documentation - https://developer.accuweather.com/apis

    (i) "Location API" --> "city search"
    (ii) "Conditions API" --> "current conditions"
*/

const getCity = async(city) => {

    const base = "http://dataservice.accuweather.com/locations/v1/cities/search";

    const query = `?apikey=${key}&q=${city}`;

    const response = await fetch(base + query);

    const data = await response.json();

    return data[0];
};

const getTopCities = async() => {
    const base = `http://dataservice.accuweather.com/locations/v1/topcities/50`;

    const query = `?apikey=${key}`;

    const response = await fetch(base + query);

    const data = await response.json();

    return data;
}

const getWeather = async(id) => {
    const base = `http://dataservice.accuweather.com/currentconditions/v1/${id}`;

    const query = `?apikey=${key}`;

    const response = await fetch(base + query);

    const data = await response.json();

    return data[0];
}

const getForecasts = async(id) => {
    const base = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${id}`;

    const query = `?apikey=${key}`;

    const response = await fetch(base + query);

    const data = await response.json();

    return data;

}

const hourlyForecast = async(id) => {
    const base = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${id}`;

    const query = `?apikey=${key}`;

    const response = await fetch(base + query);

    const data = await response.json();

    return data;
}
        
    
