import { backdrop, hourlyPlace } from "../../main";
import { getCities, getWeather } from "./requests";

/**
 * Render the weather data to the specified HTML element.
 *
 * @param {Array} data - The weather data to be rendered.
 * @param {HTMLElement} renderPlace - The HTML element where the weather data should be rendered.
 * @return {undefined} This function does not return a value.
 */
export async function renderWeather(data) {
    if (!data) return;
    if (!data.data) return;
    if (data.status !== 200 || !data.data) return;

    let cityName = document.querySelector(".city__name");
    let cityTime = document.querySelector(".time");
    let cityDate = document.querySelector(".day");

    let mainTemp = document.querySelector(".temp__main");
    let feelsLike = document.querySelector(".temp__feels_like");
    let sunrise = document.querySelector(".sunrise p");
    let sunset = document.querySelector(".sunset p");

    let weatherIcon = document.querySelector(".weather__icon");
    let weatherDescription = document.querySelector(".weather__description");

    let humidity = document.querySelector(".humidity p");
    let windSpeed = document.querySelector(".wind__speed p");
    let pressure = document.querySelector(".pressure p");
    let uvIndex = document.querySelector(".uv p");

    let time = new Date(data.data.location.localtime);
    let localtime =
        time.getMinutes() < 10
            ? `${time.getHours()}:0${time.getMinutes()}`
            : `${time.getHours()}:${time.getMinutes()}`;
    let date = `${time.getDate()} ${time.toLocaleString("en-us", {
        month: "long",
    })}, ${time.toLocaleString("en-us", { weekday: "long" })}`;
    cityName.innerHTML = data.data.location.name;
    cityTime.innerHTML = localtime;
    cityDate.innerHTML = date;

    mainTemp.innerHTML = `${data.data.current.temp_c}°C`;
    feelsLike.innerHTML = `Feels like: <span>${data.data.current.feelslike_c}°C</span>`;

    sunrise.innerHTML = data.data.forecast.forecastday[0].astro.sunrise;
    sunset.innerHTML = data.data.forecast.forecastday[0].astro.sunset;

    weatherIcon.src = data.data.current.condition.icon;
    weatherDescription.innerHTML = data.data.current.condition.text;

    humidity.innerHTML = `${data.data.current.humidity}%`;
    windSpeed.innerHTML = `${data.data.current.wind_kph} km/h`;
    pressure.innerHTML = `${data.data.current.pressure_mb} mb`;
    uvIndex.innerHTML = data.data.current.uv;
    
    render5Days(data);
    renderHourly(data);
}

/**
 * Fills a HTML element with city suggestions based on a given query.
 *
 * @param {string} query - The query string used to filter cities.
 * @param {HTMLElement} place - The HTML element to fill with city suggestions.
 * @return {Promise<void>} Resolves when the city suggestions have been filled.
 */
export async function fillCity(query, place) {
    place.innerHTML = "";
    if (!query) return;
    const cities = await getCities();
    const city = cities.find((c) =>
        c.toLowerCase().includes(query.toLowerCase())
    );
    if (!city) {
        let li = document.createElement("li");
        let span = document.createElement("span");
        li.setAttribute("data-city", query);
        span.innerHTML = query;
        li.append(span);

        place.append(li);

        li.onclick = async () => {
            renderWeather(await getWeather(query));
            place.innerHTML = "";
            backdrop.classList.remove("show");
        };

        return
    }

    let li = document.createElement("li");
    let span = document.createElement("span");
    li.setAttribute("data-city", city);
    span.innerHTML = city;
    li.append(span);

    place.append(li);

    li.onclick = async () => {
        renderWeather(await getWeather(city));
        place.innerHTML = "";
        backdrop.classList.remove("show");
    };
}

async function render5Days(data) {
    let place = document.querySelector(".forecast-5d__cards");
    place.innerHTML = "";

    for (const day of data.data.forecast.forecastday) {
        let card = document.createElement("div");
        let weather__icon = document.createElement("img");
        let weather__description = document.createElement("p");
        let day__name = document.createElement("p");

        let time = new Date(day.date);
        let date = `${time.toLocaleString("en-us", {
            weekday: "short",
        })}, ${time.getDate()} ${time.toLocaleString("en-us", {
            month: "short",
        })} `;

        card.classList.add("card");

        weather__icon.src = day.day.condition.icon;
        weather__description.innerHTML = day.day.condition.text;
        day__name.innerHTML = date;

        card.append(weather__icon, weather__description, day__name);
        place.append(card);
    }
}

async function renderHourly(data) {
    let place = hourlyPlace;
    place.innerHTML = "";

    let direction = {
        N: "↑",
        NE: "↗",
        E: "→",
        SE: "↘",
        S: "↓",
        SW: "↙",
        W: "←",
        NW: "↖",
        ESE: "↗",
        ENE: "↗",
        WSW: "↙",
        WNW: "↙",
        SSE: "↘",
        SSW: "↘",
        NNW: "↖",
        NNE: "↗",
    };

    for (const hour of data.data.forecast.forecastday[0].hour) {
        let card = document.createElement("div");
        let timeLine = document.createElement("p");
        let weather__icon = document.createElement("img");
        let weather__description = document.createElement("p");
        let wind__direction = document.createElement("p");
        let wind__speed = document.createElement("p");

        let time = new Date(hour.time);
        let HourString =
            time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
        let MinuteString =
            time.getMinutes() < 10
                ? `0${time.getMinutes()}`
                : time.getMinutes();
        let timeString = `${HourString}:${MinuteString}`;

        card.classList.add("card");
        if (time.getHours() >= 6 && time.getHours() < 18) {
            card.dataset.theme = "day__light";
        } else {
            card.dataset.theme = "night__light";
        }

        card.setAttribute("data-time", timeString);

        timeLine.innerHTML = timeString;

        weather__icon.src = hour.condition.icon;
        weather__description.innerHTML = hour.condition.text;

        wind__direction.innerHTML = direction[hour.wind_dir];
        wind__speed.innerHTML = `${hour.wind_kph} km/h`;

        card.append(
            timeLine,
            weather__icon,
            weather__description,
            wind__direction,
            wind__speed
        );

        place.append(card);
    }
}

export function makeWhite() {
    let tempNow = document.querySelector(".temp__now");
    let allImgL = tempNow.querySelectorAll(".left__side img");
    let allImgR = tempNow.querySelectorAll(".right__side img");

    for (const img of allImgL) {
        img.style.filter = "invert(100%)";
    }

    for (const img of allImgR) {
        img.style.filter = "invert(100%)";
    }
}

export function makeBlack() {
    let tempNow = document.querySelector(".temp__now");
    let allImgL = tempNow.querySelectorAll(".left__side img");
    let allImgR = tempNow.querySelectorAll(".right__side img");

    for (const img of allImgL) {
        img.removeAttribute("style");
    }

    for (const img of allImgR) {
        img.removeAttribute("style");
    }
}
