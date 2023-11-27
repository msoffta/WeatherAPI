import { onload } from "./src/scripts/events";
export let citiesPlace = document.querySelector(".search-query");
export let searchQuery = document.querySelector("#city");
export let backdrop = document.querySelector(".backdrop");
export let hourlyPlace = document.querySelector(".forecast-hourly__cards");
export let switcher = document.querySelector(".switch");
export let getMyLocation = document.querySelector(".cur_location");

window.onload = onload;
