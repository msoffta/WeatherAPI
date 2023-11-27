import {
    backdrop,
    citiesPlace,
    getMyLocation,
    hourlyPlace,
    searchQuery,
    switcher,
} from "../../main";
import { fillCity, makeBlack, makeWhite, renderWeather } from "./renders";
import { getCountry, getWeather } from "./requests";

/**
 * Retrieves the current position of the user and renders the weather data for their location.
 *
 * @return {undefined} This function does not return a value.
 */
export function getPos() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let country = await getCountry(lat, lon);

            if (country.status === 200 || country.data) {
                renderWeather(await getWeather(country.data.city));
            }
        });
    }
}

/**
 * Scrolls the parent element to the left.
 *
 * @param {WheelEvent} event - The event object.
 * @return {undefined} This function does not return a value.
 */
export function scrollEvent(event) {
    event.target.parentElement.scrollLeft += event.deltaY;
}

export function switchTheme(event) {
    let input = event.target;
    if (input.checked) {
        document.body.dataset.theme = "light";
        makeWhite();
    } else {
        document.body.dataset.theme = "dark";
        makeBlack();
    }
}

export async function queryCities(event) {
    event.preventDefault();

    const value = event.target.value;
    if (value.length === 0) {
        citiesPlace.innerHTML = "";
        return;
    }

    fillCity(value, citiesPlace);
}

export function onload() {
    getMyLocation.onclick = getPos;

    hourlyPlace.addEventListener("wheel", scrollEvent, { passive: true });

    switcher.onclick = switchTheme;

    searchQuery.oninput = queryCities;
    searchQuery.onfocus = () => {
        backdrop.classList.add("show")
        const value = searchQuery.value;
        if (value.length === 0) {
            citiesPlace.innerHTML = "";
            return;
        }
        
        fillCity(value, citiesPlace);
    };

    searchQuery.onblur = () => {
        backdrop.classList.remove("show");
        setTimeout(() => {
            citiesPlace.innerHTML = "";
        }, 500);
    };
}
