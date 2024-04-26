// JS Code for DOM Manipulation

const cityForm = document.querySelector("form");
const card = document.querySelector(".card");
const details = document.querySelector(".details");
const time = document.querySelector(".time");
const icon = document.querySelector(".icon img");
const small_cards = document.querySelector(".small-cards");
const hourImg = document.querySelector(".hourImg");
const forecastInfo = document.querySelector(".forecast-info");
const cities = document.querySelector(".cities");
const cityWeather = document.querySelector(".topCities");
const cityName = document.querySelectorAll("cityName");
const cityList = document.querySelector(".topCities");

/* 
updating the UI with the custom object (2 key-values pair [cityDetails & weather])
from the "updateCity" function
*/

const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

const topCities = async() => {
  let citiesArray = await getTopCities();
  citiesArray = citiesArray.slice(0, 10);
  return citiesArray;
}

let cityNames = [];
let cityConditions = [];

const getCityWeather = async() => {
  let citiesArray = await topCities();
  citiesArray.forEach(city => {
    let name = city.LocalizedName;
    cityNames.push(name);
  })

  cityNames.forEach(city => {
    updateCity(city)
    .then((data) => {
      updateInitialUI(data);
    })
    .catch(err => {
      console.log(err);
    })
  })
  console.log(citiesArray);
}

getCityWeather();

let tops = [];

const updateInitialUI = (data) => {
  const cityDetails = data.cityDetails;
  const weather = data.weather;

  const timeZone = cityDetails.TimeZone.Name;
  
  
  cityWeather.innerHTML += `
    <div class="cityWeather p-2 mb-2">  
      <span class="text-xl pl-2">${Math.round(weather.Temperature.Metric.Value)}</span>
      <span class="cityDegree">&deg; C</span>
      <p class="cityName pl-2">${cityDetails.EnglishName}</p>
      <img class="float-right" src="img/icons/${weather.WeatherIcon}.svg" alt="">
    </div>
  `;

  tops.push(cityDetails.EnglishName);
}

cityWeather.addEventListener("click", (e) => {
  if(e.target.classList.contains("cityWeather")){
    let childrenArray = Array.from(e.target.children);
    let city = childrenArray[2].innerHTML;
    if(tops.includes(city)){
      updateCity(city)
        .then(data => {
          updateUI(data);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
  cityList.classList.add("scroll");
})


let chart;

const updateUI = (data) =>{
    const cityDetails = data.cityDetails;
    const weather = data.weather;
    const forecast = data.forecast.DailyForecasts;
    const hourly = data.hourly;

    console.log(cityDetails);
    console.log(weather);
    console.log(forecast);
    console.log(hourly);
    

    const timeZone = cityDetails.TimeZone.Name;
    const now = new Date();
    const timeNow = {timeZone: timeZone, hour12: false};
    const date = {day: "2-digit", month: "2-digit"};
    const dayShort = {weekday: "short"};
    const dayLong = {weekday: "long"};
    const currentTime = now.toLocaleTimeString('en-US', timeNow).split(':').slice(0, 2).join(':');
    const currentDate = now.toLocaleDateString('en-GB', date);
    const currentDayShort = now.toLocaleDateString('en-US', dayShort);
    const currentDayLong = now.toLocaleDateString('en-US', dayLong);

    cityList.classList.add("scroll");

    details.innerHTML = `
      <div class="flex">
          <div class="text-6xl my-4">
              <span>${Math.round(weather.Temperature.Metric.Value)}</span>
          </div>
          <div class="degree">
              <span>&deg; C</span>
          </div>
      </div>
      <div class="pb-3 dateTime">
          <span>${currentDayLong}</span>
          <span>&#44;<span>
          <span>${currentTime}</span>
      </div>
      <hr>
      <h5 class="my-3">${cityDetails.EnglishName}</h5>
      <div class="my-3">${weather.WeatherText}</div>
      `;

    small_cards.innerHTML = '';

    forecastInfo.classList.remove("hidden");

    for(let i = 0; i < forecast.length; i++){
        const timeString = forecast[i].Date;
        const dates = new Date(timeString);
        const dayOfWeek = dates.getDay();

        small_cards.innerHTML += `
        <div class="card-sm">
            <p>${days[dayOfWeek]}</p>
            <img src="img/icons/${forecast[i].Day.Icon}.svg" alt="">
            <span class="vl">${Math.round((forecast[i].Temperature.Minimum.Value - 32)*5/9)}</span>
            <span>${Math.round((forecast[i].Temperature.Maximum.Value - 32)*5/9)}</span>
        </div>
        `;
    }

    let tempData = [];
    let hour = [];

    for(let i = 0; i < hourly.length; i++){
        let celcius = Math.round((hourly[i].Temperature.Value -32)*5/9);
        tempData.push(celcius);

        let h = parseInt(currentTime.split(':')[0] + "00");
        let time = parseInt(h) + 100*i;
        if((h + (i*100)) > 2300){
            time -= 2400;
        }
        time = parseFloat(time);
        time = String(time).padStart(4, '0');
        hour.push(time);
    }
    
    // Check if a chart instance already exists
    if (chart) {
    // Update the existing chart instance with new data
        chart.data.labels = hour;
        chart.data.datasets[0].data = tempData;
        chart.data.datasets[0].label = `${cityDetails.EnglishName}`;
        chart.update();
    } else {
    // Create a new chart instance
    chart = new Chart(document.getElementById("line-chart"), {
      type: 'line',
      data: {
        labels: hour,
        datasets: [
          {
            data: tempData,
            label: `${cityDetails.EnglishName}`,
            borderColor: "#3e95cd",
            fill: false
          }
        ]
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: 'Temperature Celcius',
              font: {
                size: 16
              }
            }
          }
        },
        legend: {
          labels: {
            boxWidth: 0,
          }
        }
      }
    });
  }

  hourImg.innerHTML = "";

  hourly.forEach((hour) => {
    hourImg.innerHTML += `
    <img src="img/icons/${hour.WeatherIcon}.svg" alt="">`;
  })

  
    // get the icon from --> https://thenounproject.com/browse/collection-icon/climacons-10/?p=1
    const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
    icon.setAttribute("src", iconSrc);

    if(card.classList.contains("hidden")){
        card.classList.remove("hidden");
    }
}


const updateCity = async(city) => {

    //using the 2 async APIs call function in our forecast.js
    const cityDetails = await getCity(city);
    const weather = await getWeather(cityDetails.Key);
    const forecast = await getForecasts(cityDetails.Key);
    const hourly = await hourlyForecast(cityDetails.Key);

    // return a custom object with 2 key-values pairs
    return{
        cityDetails: cityDetails,
        weather: weather,
        forecast: forecast,
        hourly: hourly
    };
}


cityForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get city value from our <form> input
    const city = cityForm.city.value.trim();

    cityForm.reset();

    // get the city details & weather info
    updateCity(city)
        // .then((data) => {
        //     console.log(data);
        // })
        .then((data) => {
            updateUI(data)
        })
        .catch((err) => {
            console.log(err);
        });
});