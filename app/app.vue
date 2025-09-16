<script setup>
import { format, getHours, startOfHour } from 'date-fns'

const search = useState('search', () => '')
const results = useState('results', () => [])
const loadingResults = useState('loadingResults', () => false)
const showResults = useState('showResults', () => false)
const activeResult = useState('activeResult', () => null)

const place = useState('place', () => null)
const loadingPlace = useState('loadingPlace', () => false)
const selectedDay = useState('selectedDay', () => format(new Date(), 'EEEE'))

const preferences = usePreferencesCookie()

const daily = useState('daily', () => null)
const hourly = useState('hourly', () => null)

const submit = async () => {
  loadingResults.value = true

  showResults.value = true

  const response = await fetchCoordsForLocation(search.value)

  loadingResults.value = false

  results.value = response.results
}

const dailyForecast = computed(() => {
  if (!daily.value?.time) {
    return []
  }

  return daily.value.time.map((date) => {
    const index = daily.value.time.indexOf(date)

    return {
      day: format(date, 'EEE'),
      min: Math.round(daily.value.temperature_2m_min[index]) + '°',
      max: Math.round(daily.value.temperature_2m_max[index]) + '°',
      weatherCode: daily.value.weather_code[index],
    }
  })
})

const hourlyForecast = computed(() => {
  if (!hourly.value?.time) {
    return []
  }

  const startTime = startOfHour(new Date())

  return hourly.value.time
    .filter((date) => {
      const forecastDate = new Date(date)
      const isSameDay = format(forecastDate, 'EEEE') === selectedDay.value

      // Only include hours for the same day
      if (!isSameDay) {
        return false
      }

      const isToday = format(startTime, 'EEEE') === selectedDay.value
      const forecastHour = getHours(forecastDate)
      const startHour = getHours(startTime)

      return isToday ? forecastHour >= startHour : true
    })
    .map((date) => {
      const index = hourly.value.time.indexOf(date)

      return {
        temperature: Math.round(hourly.value.temperature_2m[index]) + '°',
        isoTime: format(date, 'HH:mm'),
        time: format(date, 'h a'),
        weatherCode: hourly.value.weather_code[index],
      }
    })
})

const setPlace = async (result) => {
  activeResult.value = result

  search.value = ''

  showResults.value = false

  loadingPlace.value = true

  const response = await fetchForecastForCoords(result.latitude, result.longitude)

  loadingPlace.value = false

  const current = response.current
  daily.value = response.daily
  hourly.value = response.hourly

  // prettier-ignore
  place.value = {
    date: format(new Date(), 'EEEE, MMM d, yyyy'),
    name: result.name,
    feelsLike: Math.round(current.apparent_temperature) + '°',
    humidity: current.relative_humidity_2m + '%',
    precipitation: preferences.value.precipitation === 'imperial'
      ? Math.round(current.precipitation / 25.4) + ' in'
      : Math.round(current.precipitation) + ' mm',
    temperature: Math.round(current.temperature_2m) + '°',
    weatherCode: current.weather_code,
    wind: preferences.value.windSpeed === 'imperial'
      ? Math.round(current.wind_speed_10m * 2.23694) + ' mph'
      : Math.round(current.wind_speed_10m * 3.6) + ' km/h',
  }
}

watch(
  () => ({
    temperature: preferences.value.temperature,
    windSpeed: preferences.value.windSpeed,
    precipitation: preferences.value.precipitation,
  }),
  async (newValues, oldValues) => {
    if (!activeResult.value) {
      return false
    }

    if (
      newValues.temperature !== oldValues.temperature ||
      newValues.windSpeed !== oldValues.windSpeed ||
      newValues.precipitation !== oldValues.precipitation
    ) {
      await setPlace(activeResult.value)
    }
  },
  { deep: true },
)
</script>

<template>
  <Nav />
  <main class="mt-12 xl:mt-16">
    <h1 class="text-center font-bricolage-grotesque text-6xl font-bold md:mx-auto md:max-w-lg xl:max-w-none">How's the sky looking today?</h1>
    <form @submit.prevent="submit" class="mt-12 items-center md:grid md:grid-cols-[1fr_auto] md:gap-4 xl:mx-auto xl:mt-16 xl:max-w-2xl">
      <div class="relative flex items-center">
        <IconSearch class="pointer-events-none absolute left-6" />
        <input
          v-model="search"
          type="search"
          placeholder="Search for a place..."
          required
          minlength="3"
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
          <li class="flex items-center gap-2.5 p-2" v-else>
            <IconLoadingSpinner />
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
    <div v-if="place && !loadingPlace" class="xl:mx-auto xl:mt-12 xl:grid xl:max-w-7xl xl:grid-cols-[50rem_24rem] xl:gap-8">
      <div class="mt-8 xl:mt-0">
        <section
          class="h-[286px] w-full rounded-[1.25rem] bg-today-small bg-cover bg-no-repeat py-10 text-center md:flex md:items-center md:justify-between md:bg-today-large md:px-6 md:text-left"
        >
          <div>
            <h2 class="text-3xl font-bold">{{ place.name }}</h2>
            <p class="mt-3 text-lg opacity-80">{{ place.date }}</p>
          </div>
          <div class="mt-4 inline-flex items-center gap-5 md:mt-0">
            <WeatherCode :weatherCode="place.weatherCode" width="120" height="120" />
            <p class="text-8xl italic">{{ place.temperature }}</p>
          </div>
        </section>
        <section class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 xl:mt-8 xl:gap-6">
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
        </section>
        <section v-if="dailyForecast.length" class="mt-8 xl:mt-[3.75rem]">
          <h2 class="text-xl font-semibold">Daily forecast</h2>
          <ul class="mt-5 grid grid-cols-[repeat(auto-fit,minmax(89px,1fr))] gap-4">
            <li
              v-for="forecast in dailyForecast"
              :key="forecast.day"
              class="h-[167px] rounded-xl border border-neutral-600 bg-neutral-800 px-2.5 py-4 text-center"
            >
              <p class="text-lg">{{ forecast.day }}</p>
              <WeatherCode :weatherCode="forecast.weatherCode" class="inline-block md:mt-4" width="60" height="60" />
              <div class="flex justify-between md:mt-4">
                <p>
                  <span class="sr-only">Minimum temperature:</span>
                  {{ forecast.min }}
                </p>
                <p class="text-neutral-200">
                  <span class="sr-only">Maximum temperature:</span>
                  {{ forecast.max }}
                </p>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <section v-if="hourlyForecast.length" class="mt-8 max-h-[709px] overflow-y-scroll rounded-xl bg-neutral-800 px-4 pb-5 md:px-6 md:pb-6 xl:mt-0">
        <div class="sticky top-0 flex items-center justify-between bg-neutral-800 pb-4 pt-5 md:pt-6">
          <h2 class="text-xl font-semibold">Hourly forecast</h2>
          <DayDropdown v-model="selectedDay" />
        </div>
        <ul class="space-y-4">
          <li
            v-for="forecast in hourlyForecast"
            :key="forecast.time"
            class="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-700 py-2.5 pl-3 pr-4"
          >
            <WeatherCode :weatherCode="forecast.weatherCode" width="40" height="40" />
            <time :datetime="forecast.isoTime" class="text-lg">{{ forecast.time }}</time>
            <p class="col-start-4">
              <span class="sr-only">Mean temperature:</span>
              {{ forecast.temperature }}
            </p>
          </li>
        </ul>
      </section>
    </div>
    <div v-else-if="loadingPlace" class="xl:mx-auto xl:mt-12 xl:grid xl:max-w-7xl xl:grid-cols-[50rem_24rem] xl:gap-8">
      <div class="mt-8 xl:mt-0">
        <div class="grid h-[286px] place-items-center rounded-[1.25rem] bg-neutral-800 text-center">
          <div>
            <IconLoading />
            <p class="text-lg text-neutral-200">Loading...</p>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 xl:mt-8 xl:gap-6">
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Feels Like</p>
            <p class="mt-6 text-4xl font-light">&ndash;</p>
          </div>
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Humidity</p>
            <p class="mt-6 text-4xl font-light">&ndash;</p>
          </div>
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Wind</p>
            <p class="mt-6 text-4xl font-light">&ndash;</p>
          </div>
          <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
            <p class="text-lg text-neutral-200">Precipitation</p>
            <p class="mt-6 text-4xl font-light">&ndash;</p>
          </div>
        </div>
        <div class="mt-8 xl:mt-[3.75rem]">
          <h2 class="text-xl font-semibold">Daily forecast</h2>
          <ul class="mt-5 grid grid-cols-[repeat(auto-fit,minmax(89px,1fr))] gap-4">
            <li v-for="day in 7" :key="day" class="h-[167px] rounded-xl border border-neutral-600 bg-neutral-800 px-2.5 py-4 text-center"></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 max-h-[709px] overflow-y-scroll rounded-xl bg-neutral-800 px-4 pb-5 md:px-6 md:pb-6 xl:mt-0">
        <div class="sticky top-0 flex items-center justify-between bg-neutral-800 pb-4 pt-5 md:pt-6">
          <h2 class="text-xl font-semibold">Hourly forecast</h2>
          <DayDropdown v-model="selectedDay" :loading="true" />
        </div>
        <div class="space-y-4">
          <Skeleton v-for="hour in 8" :key="hour" class="h-[62px] rounded-lg border border-neutral-600 bg-neutral-700 py-2.5 pl-3 pr-4" />
        </div>
      </div>
    </div>
  </main>
</template>
