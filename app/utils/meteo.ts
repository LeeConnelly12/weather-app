import { fetchWeatherApi } from 'openmeteo'

export async function fetchCoordsForLocation(location: string) {
  const url = 'https://geocoding-api.open-meteo.com/v1/search'

  const params = new URLSearchParams({
    name: location,
  })

  const { data } = await useFetch(url + '?' + params.toString())

  return data.value
}

export async function fetchForecastForCoords(latitude: number, longitude: number) {
  const url = 'https://api.open-meteo.com/v1/forecast'

  const params = {
    latitude: latitude,
    longitude: longitude,
    daily: 'temperature_2m_min,temperature_2m_max,weather_code',
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
    hourly: 'weather_code,temperature_2m,precipitation',
  }

  const responses = await fetchWeatherApi(url, params)

  const response = responses[0]

  const utcOffsetSeconds = response.utcOffsetSeconds()
  const daily = response.daily() || null
  const current = response.current() || null
  const hourly = response.hourly() || null

  const dailyTimeArray = daily
    ? [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map((_, i) =>
        new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000).toISOString().slice(0, 10),
      )
    : []

  const hourlyTimeArray = hourly
    ? [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map((_, i) =>
        new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000).toISOString(),
      )
    : []

  const weatherData = {
    ...(daily && {
      daily: {
        time: dailyTimeArray,
        temperature_2m_min: daily.variables(0)!.valuesArray(),
        temperature_2m_max: daily.variables(1)!.valuesArray(),
        weather_code: daily.variables(2)!.valuesArray(),
      },
    }),
    ...(current && {
      current: {
        temperature_2m: current.variables(0)!.value(),
        apparent_temperature: current.variables(1)!.value(),
        relative_humidity_2m: current.variables(2)!.value(),
        wind_speed_10m: current.variables(3)!.value(),
        precipitation: current.variables(4)!.value(),
        weather_code: current.variables(5)!.value(),
      },
    }),
    ...(hourly && {
      hourly: {
        time: hourlyTimeArray,
        weather_code: hourly.variables(0)!.valuesArray(),
        temperature_2m: hourly.variables(1)!.valuesArray(),
        precipitation: hourly.variables(2)!.valuesArray(),
      },
    }),
  }

  return weatherData
}
