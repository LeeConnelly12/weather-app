<script setup>
import { format } from 'date-fns'

const activeResult = ref(null)

const place = ref(null)
const loading = useState('loading', () => false)

const preferences = usePreferencesCookie()

const dailyData = ref(null)
const hourlyData = ref(null)

const setPlace = async (result) => {
  activeResult.value = result

  loading.value = true

  const response = await fetchForecastForCoords(result.latitude, result.longitude)

  loading.value = false

  const current = response.current
  dailyData.value = response.daily
  hourlyData.value = response.hourly

  // prettier-ignore
  place.value = {
    date: format(new Date(), 'EEEE, MMM d, yyyy'),
    name: result.name + ', ' + result.country,
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
    <SearchForm @selectedResult="setPlace" />
    <div class="xl:mx-auto xl:mt-12 xl:grid xl:max-w-7xl xl:grid-cols-[50rem_24rem] xl:gap-8">
      <div class="mt-8 xl:mt-0">
        <template v-if="!loading && place">
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
        </template>
        <template v-if="loading">
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
        </template>
        <DailyForecast :dailyData="dailyData" />
      </div>
      <HourlyForecast :hourlyData="hourlyData" />
    </div>
  </main>
</template>
