<script setup>
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
  if (!place.value?.forecast?.time) {
    return []
  }

  const forecast = place.value.forecast

  return forecast.time.map((date) => {
    const index = forecast.time.indexOf(date)

    return {
      day: 'Tue',
      min: forecast.temperature_2m_min[index],
      max: forecast.temperature_2m_max[index],
    }
  })
})

const setPlace = async (result) => {
  const forecast = await fetchForecastForCoords(result.latitude, result.longitude)

  place.value = {
    name: result.name,
    forecast: forecast,
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
      <h2>{{ place.name }}</h2>
      <p>{{ new Date().toLocaleDateString() }}</p>
    </div>
    <div v-if="dailyForecast.length">
      <h2>Daily forecast</h2>
      <ul>
        <li v-for="forecast in dailyForecast" :key="forecast.day">
          <p>{{ forecast.day }}</p>
          <p>{{ forecast.min }}</p>
          <p>{{ forecast.max }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
