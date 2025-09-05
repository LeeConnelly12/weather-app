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
    daily: 'temperature_2m_min,temperature_2m_max',
  }

  const responses = await fetchWeatherApi(url, params)

  const response = responses[0]

  const utcOffsetSeconds = response.utcOffsetSeconds()
  const daily = response.daily?.() || null

  const dailyTimeArray = daily
    ? [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map((_, i) =>
        new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000).toISOString().slice(0, 10),
      )
    : []

  const weatherData = {
    ...(daily && {
      daily: {
        time: dailyTimeArray,
        temperature_2m_min: daily.variables(0)!.valuesArray(),
        temperature_2m_max: daily.variables(1)!.valuesArray(),
      },
    }),
  }

  return weatherData.daily
}
