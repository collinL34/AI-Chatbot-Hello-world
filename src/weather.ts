import { getLocation } from "./location";

export async function getLocalWeather() {
  const current = getLocation();
  const url = `http://api.weatherapi.com/v1/current.json?q=${current.latitude},${current.longitude}&key=${process.env["WEATHER_API_KEY"]}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const weather = data.current;

    return {
      location: data.location,
      ...weather,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getLocalWeatherForecast(days: Number) {
  const current = getLocation();
  const url = `http://api.weatherapi.com/v1/forecast.json?q=${current.latitude},${current.longitude}&key=${process.env["WEATHER_API_KEY"]}&days=${days}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const forecast = data.forecast.forecastday;

    return {
      ...forecast,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
