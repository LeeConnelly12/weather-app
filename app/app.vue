<script setup>
import { addHours, format, startOfHour } from 'date-fns'

useHead({
  title: 'Weather App',
  bodyAttrs: {
    class: 'bg-neutral-900 text-white',
  },
})

const search = useState('search', () => '')

const results = useState('results', () => [])

const place = useState('place', () => null)

const selectedDay = useState('selectedDay', () => format(new Date(), 'EEEE'))
const currentTime = new Date()

const submit = async () => {
  const response = await fetchCoordsForLocation(search.value)

  results.value = response.results
}

const dailyForecast = computed(() => {
  if (!place.value?.dailyForecast?.time) {
    return []
  }

  const forecast = place.value.dailyForecast

  return forecast.time.map((date) => {
    const index = forecast.time.indexOf(date)

    return {
      day: format(date, 'EEE'),
      min: Math.round(forecast.temperature_2m_min[index]) + '°',
      max: Math.round(forecast.temperature_2m_max[index]) + '°',
      weatherCode: forecast.weather_code[index],
    }
  })
})

const hourlyForecast = computed(() => {
  if (!place.value?.hourlyForecast?.time) {
    return []
  }

  const forecast = place.value.hourlyForecast

  const startTime = startOfHour(currentTime)
  const endTime = addHours(currentTime, 8)

  return forecast.time
    .filter((date) => {
      const forecastDate = new Date(date)

      if (format(forecastDate, 'EEEE') !== selectedDay.value) {
        return false
      }

      return forecastDate >= startTime && forecastDate <= endTime
    })
    .map((date) => {
      const index = forecast.time.indexOf(date)

      return {
        temperature: Math.round(forecast.temperature_2m[index]) + '°',
        time: format(date, 'h a'),
        weatherCode: forecast.weather_code[index],
      }
    })
})

const setPlace = async (result) => {
  const { current, daily, hourly } = await fetchForecastForCoords(result.latitude, result.longitude)

  place.value = {
    date: format(new Date(), 'EEEE, MMM d, yyyy'),
    dailyForecast: daily,
    hourlyForecast: hourly,
    feelsLike: Math.round(current.apparent_temperature) + '°',
    humidity: current.relative_humidity_2m,
    name: result.name,
    precipitation: current.precipitation,
    temperature: Math.round(current.temperature_2m) + '°',
    weatherCode: current.weather_code,
    wind: current.wind_speed_10m,
  }
}
</script>

<template>
  <div>
    <h1>How's the sky looking today?</h1>
    <form @submit.prevent="submit">
      <input v-model="search" type="text" class="text-black" placeholder="Search for a place..." />
      <button type="submit">Search</button>
    </form>
    <ul v-if="results.length">
      <li v-for="result in results" :key="result.id">
        <button type="button" @click="setPlace(result)">
          {{ result.name }}
        </button>
      </li>
    </ul>
    <div v-if="place">
      <div>
        <h2>{{ place.name }}</h2>
        <p>{{ place.date }}</p>
      </div>
      <div>
        <WeatherCode :weatherCode="place.weatherCode" />
        <p>{{ place.temperature }}</p>
      </div>
      <div>
        feels like
        <div>{{ place.feelsLike }}</div>
      </div>
      <div>
        humidity
        <div>{{ place.humidity }}</div>
      </div>
      <div>
        wind
        <div>{{ place.wind }}</div>
      </div>
      <div>
        precipitation
        <div>{{ place.precipitation }}</div>
      </div>
    </div>
    <div v-if="dailyForecast.length">
      <h2>Daily forecast</h2>
      <ul>
        <li v-for="forecast in dailyForecast" :key="forecast.day">
          <p>{{ forecast.day }}</p>
          <WeatherCode :weatherCode="forecast.weatherCode" />
          <p>{{ forecast.min }}</p>
          <p>{{ forecast.max }}</p>
        </li>
      </ul>
    </div>
    <div v-if="hourlyForecast.length">
      <h2>Hourly forecast</h2>
      <ul>
        <li v-for="forecast in hourlyForecast" :key="forecast.time">
          <p>{{ forecast.time }}</p>
          <WeatherCode :weatherCode="forecast.weatherCode" />
          <p>{{ forecast.temperature }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
