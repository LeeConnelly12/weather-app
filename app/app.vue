<script setup>
import { addHours, format, startOfHour } from 'date-fns'

const search = useState('search', () => '')

const results = useState('results', () => [])

const place = useState('place', () => null)

const selectedDay = useState('selectedDay', () => format(new Date(), 'EEEE'))

const isCelsius = useState('isCelsius', () => true)

const currentTime = new Date()

const selectedResult = useState('selectedResult', () => null)

const loadingResults = useState('loadingResults', () => false)

const showResults = useState('showResults', () => false)

const submit = async () => {
  loadingResults.value = true

  showResults.value = true

  const response = await fetchCoordsForLocation(search.value)

  loadingResults.value = false

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
  selectedResult.value = result

  const { current, daily, hourly } = await fetchForecastForCoords(result.latitude, result.longitude, isCelsius.value)

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

  showResults.value = false
}

const switchUnits = async () => {
  isCelsius.value = !isCelsius.value

  await setPlace(selectedResult.value)
}
</script>

<template>
  <div>
    <nav class="flex items-center justify-between lg:mx-auto lg:max-w-7xl">
      <Logo class="w-[138px] md:w-[197px]" />
      <button
        type="button"
        class="flex items-center gap-[0.375rem] rounded-md bg-neutral-800 px-2.5 py-2 outline-none focus:outline-2 focus:outline-white md:gap-2"
      >
        <img src="/images/icon-units.svg" alt="" width="16" height="16" />
        <p class="text-sm">Units</p>
        <img src="/images/icon-dropdown.svg" alt="" width="13" height="8" />
      </button>
    </nav>
    <div class="mt-12 lg:mt-16">
      <h1 class="text-center font-bricolage-grotesque text-6xl font-bold md:mx-auto md:max-w-lg lg:max-w-none">How's the sky looking today?</h1>
      <form @submit.prevent="submit" class="mt-12 items-center md:grid md:grid-cols-[1fr_auto] md:gap-4 lg:mx-auto lg:mt-16 lg:max-w-2xl">
        <div class="relative flex items-center">
          <img class="pointer-events-none absolute left-6" src="/images/icon-search.svg" alt="" />
          <input
            v-model="search"
            type="text"
            placeholder="Search for a place..."
            class="h-14 w-full rounded-xl bg-neutral-800 pl-[3.75rem] pr-6 text-white outline-none placeholder:text-neutral-200 focus:outline-2 focus:outline-white"
          />
          <ul
            v-if="showResults"
            class="absolute top-full z-10 mt-2 grid max-h-44 w-full gap-1 overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-800 p-2"
            tabindex="-1"
          >
            <li v-if="!loadingResults" v-for="result in results" :key="result.id">
              <button
                type="button"
                class="w-full rounded-lg border border-transparent p-2 text-left outline-none hover:border-neutral-600 hover:bg-neutral-700 focus:border-neutral-600 focus:bg-neutral-700 focus:outline-2 focus:outline-white"
                @click="setPlace(result)"
              >
                {{ result.name }}
              </button>
            </li>
            <li class="flex gap-2.5 p-2" v-else>
              <img src="/images/icon-loading.svg" alt="" width="16" height="16" />
              <p class="w-full rounded-lg border border-transparent text-left">Search in progress</p>
            </li>
          </ul>
        </div>
        <button
          type="submit"
          class="mt-3 h-14 w-full rounded-xl bg-blue-500 text-xl outline-none hover:bg-blue-700 focus:outline-2 focus:outline-blue-500 md:mt-0 md:px-6"
        >
          Search
        </button>
      </form>
    </div>
    <div v-if="place" class="lg:mx-auto lg:mt-12 lg:grid lg:max-w-7xl lg:grid-cols-[50rem_24rem] lg:gap-8">
      <div class="mt-8 lg:mt-0 lg:grid lg:grid-rows-[auto_auto_1fr_auto]">
        <div
          class="h-[286px] w-full rounded-[1.25rem] bg-today-small bg-cover bg-no-repeat py-10 text-center md:flex md:items-center md:justify-between md:bg-today-large md:px-6 md:text-left"
        >
          <div>
            <h2 class="text-3xl font-bold">{{ place.name }}</h2>
            <p class="mt-3 text-lg opacity-80">{{ place.date }}</p>
          </div>
          <div class="mt-4 inline-flex items-center gap-5">
            <WeatherCode :weatherCode="place.weatherCode" class="size-[120px]" />
            <p class="text-8xl">{{ place.temperature }}</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 lg:mt-8 lg:gap-6">
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Feels Like</p>
            <p class="mt-6 text-4xl font-light">{{ place.feelsLike }}</p>
          </div>
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Humidity</p>
            <p class="mt-6 text-4xl font-light">{{ place.humidity }}</p>
          </div>
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Wind</p>
            <p class="mt-6 text-4xl font-light">{{ place.wind }}</p>
          </div>
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Precipitation</p>
            <p class="mt-6 text-4xl font-light">{{ place.precipitation }}</p>
          </div>
        </div>
        <div v-if="dailyForecast.length" class="mt-8 lg:row-start-4 lg:mt-0">
          <h2 class="text-xl font-semibold">Daily forecast</h2>
          <ul class="mt-5 grid grid-cols-[repeat(auto-fit,minmax(89px,1fr))] gap-4">
            <li
              v-for="forecast in dailyForecast"
              :key="forecast.day"
              class="rounded-xl border border-neutral-600 bg-neutral-800 px-2.5 py-4 text-center"
            >
              <p class="text-lg">{{ forecast.day }}</p>
              <WeatherCode :weatherCode="forecast.weatherCode" class="inline-block size-[60px] md:mt-4" />
              <div class="flex justify-between md:mt-4">
                <p>{{ forecast.min }}</p>
                <p class="text-neutral-200">{{ forecast.max }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="hourlyForecast.length" class="mt-8 rounded-xl bg-neutral-800 px-4 py-5 md:p-6 lg:mt-0">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Hourly forecast</h2>
          <button type="button" class="flex gap-[0.375rem] rounded-md bg-neutral-600 px-4 py-2 outline-none focus:outline-2 focus:outline-white">
            <p>{{ selectedDay }}</p>
            <img src="/images/icon-dropdown.svg" alt="" width="13" height="8" />
          </button>
        </div>
        <ul>
          <li
            v-for="forecast in hourlyForecast"
            :key="forecast.time"
            class="mt-4 grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-700 py-1.5 pl-3 pr-4"
          >
            <WeatherCode :weatherCode="forecast.weatherCode" class="size-[40px]" />
            <p class="text-lg">{{ forecast.time }}</p>
            <p class="col-start-4">{{ forecast.temperature }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
