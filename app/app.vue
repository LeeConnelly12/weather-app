<script setup>
import { format } from 'date-fns'

useHead({
  title: 'Weather App',
  bodyAttrs: {
    class: 'bg-neutral-900 text-white',
  },
})

const search = useState('search', () => '')

const results = useState('results', () => [])

const place = useState('place', () => null)

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
      min: forecast.temperature_2m_min[index],
      max: forecast.temperature_2m_max[index],
      weatherCode: forecast.weather_code[index],
    }
  })
})

const setPlace = async (result) => {
  const { current, daily } = await fetchForecastForCoords(result.latitude, result.longitude)

  place.value = {
    date: format(new Date(), 'EEEE, MMM d, yyyy'),
    dailyForecast: daily,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    name: result.name,
    precipitation: current.precipitation,
    temperature: current.temperature_2m,
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
  </div>
</template>
