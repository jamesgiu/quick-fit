import { fetchWeatherApi } from "openmeteo";

export interface WeatherType {
  hourly: {
    time: Date[];
    temperature2m: Float32Array;
  };
  current: {
    time: Date;
    temperature2m: number;
    apparentTemperature: number;
    isDay: number;
    relativeHumidity2m: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    windSpeed10m: number;
  };
  daily: {
    time: Date[];
    temperature2mMax: Float32Array;
    temperature2mMin: Float32Array;
    apparentTemperatureMax: Float32Array;
    apparentTemperatureMin: Float32Array;
    sunrise: Float32Array;
    sunset: Float32Array;
  };
}

export function getWeather(onSuccessCallback: (weather: WeatherType) => void) {
  const params = {
    latitude: -37.814,
    longitude: 144.9633,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation_probability",
      "rain",
      "showers",
      "snowfall",
      "wind_speed_10m",
    ],
    // FIXME weirdly low data ?? I think temperature2m index, 0 == midnight!
    hourly: ["temperature_2m"],
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "sunrise",
      "sunset",
    ],
    timezone: "Australia/Sydney",
    forecast_days: 2,
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  fetchWeatherApi(url, params).then((resp) => {
    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = resp[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)!.value(),
        relativeHumidity2m: current.variables(1)!.value(),
        apparentTemperature: current.variables(2)!.value(),
        isDay: current.variables(3)!.value(),
        precipitation: current.variables(4)!.value(),
        rain: current.variables(5)!.value(),
        showers: current.variables(6)!.value(),
        snowfall: current.variables(7)!.value(),
        windSpeed10m: current.variables(8)!.value(),
      },
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval(),
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval(),
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2mMax: daily.variables(0)!.valuesArray()!,
        temperature2mMin: daily.variables(1)!.valuesArray()!,
        apparentTemperatureMax: daily.variables(2)!.valuesArray()!,
        apparentTemperatureMin: daily.variables(3)!.valuesArray()!,
        sunrise: daily.variables(4)!.valuesArray()!,
        sunset: daily.variables(5)!.valuesArray()!,
      },
    };
    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    onSuccessCallback(weatherData);
  });
}
