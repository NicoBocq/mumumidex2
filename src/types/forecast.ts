import {Location } from "./geocoding";

export type CurrentForecast = {
  time: string;
  interval: number
  current: {}
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  humidex: number;
}

export type WeatherApiResponse = {
    latitude: number;
    longitude: number;
   timezone: string;
  current: CurrentForecast;
  location: Location
}