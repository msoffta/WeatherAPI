import axios from "axios";

export async function getWeather(query) {
    try {
        const baseUrl = `http://api.weatherapi.com/v1/forecast.json`;
        const apiKey = import.meta.env.VITE_WEATHER_KEY;
        const url = `${baseUrl}?key=${apiKey}&q=${query}&aqi=no&days=5&alerts=no`;
        const response = await axios.get(url);

        return { data: response.data, status: response.status };
    } catch (error) {
        alert(`Error: ${error}\n Check logs for more details.`);
        console.log(error);
    }
}

export async function getCities() {
    try {
        if (localStorage.getItem("cities"))
            return JSON.parse(localStorage.getItem("cities"));

        const cities = [];

        const response = await axios.get(
            "https://countriesnow.space/api/v0.1/countries"
        );

        if (response.data) {
            const { data, msg, error } = response.data;

            if (!error) {
                for (const city of data) {
                    cities.push(...city.cities);
                }
            } else {
                console.log(msg);
            }

            const save = JSON.stringify(cities);
            localStorage.setItem("cities", save);

            return cities;
        }
    } catch (error) {
        alert(`Error: Can't get cities list. ${error}\n Check logs for more details.`);
        console.log(error);
    }
}

export async function getCountry(lat, lon) {
    try {
        let url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const response = await axios.get(url);

        return { data: response.data, status: response.status };
    } catch (error) {
        alert(`Error: ${error}\n Check logs for more details.`);
        console.log(error);
    }
}
