<script setup>
const activeResult = ref(null)

const loading = useState('loading', () => false)

const preferences = usePreferencesCookie()

const currentData = ref(null)
const dailyData = ref(null)
const hourlyData = ref(null)

const setPlace = async (result) => {
  activeResult.value = result

  loading.value = true

  const response = await fetchForecastForCoords(result.latitude, result.longitude)

  loading.value = false

  currentData.value = response.current
  dailyData.value = response.daily
  hourlyData.value = response.hourly

  addToViewedLocations(result)
}

const addToViewedLocations = (location) => {
  if (location.name === preferences.value.name) {
    return
  }

  if (preferences.value.viewedLocations.includes(location)) {
    return
  }

  preferences.value.viewedLocations = [...preferences.value.viewedLocations, location]

  if (preferences.value.viewedLocations.length > 2) {
    preferences.value.viewedLocations.shift()
  }
}

const clearPlaces = () => {
  preferences.value.viewedLocations = []
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
  {
    deep: true,
    immediate: false,
  },
)

const { data, status } = await useFetch('/api/geolocation')

onMounted(async () => {
  if (status.value === 'success') {
    preferences.value = { ...preferences.value, ...data.value }

    await setPlace(data.value)
  }
})
</script>

<template>
  <Nav />
  <main class="mt-12 xl:mt-16">
    <h1 class="text-center font-bricolage-grotesque text-6xl font-bold md:mx-auto md:max-w-lg xl:max-w-none">How's the sky looking today?</h1>
    <SearchForm @selectedResult="setPlace" />
    <section v-if="preferences.viewedLocations.length" class="mt-8 xl:mx-auto xl:max-w-7xl">
      <div class="flex items-center justify-between sm:justify-normal sm:gap-6">
        <h2 class="text-xl font-semibold">Viewed places</h2>
        <button
          @click="clearPlaces"
          type="button"
          aria-label="Clear viewed places"
          class="h-10 rounded-xl bg-neutral-800 px-6 outline-none hover:bg-neutral-700 focus:outline-2 focus:outline-white md:mt-0 md:px-6"
        >
          Clear
        </button>
      </div>
      <ul class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="location in preferences.viewedLocations" class="flex">
          <button
            @click="setPlace(location)"
            class="flex h-28 w-full flex-col rounded-xl border border-neutral-600 bg-neutral-800 p-5 text-left outline-none focus:outline-2 focus:outline-white"
            :aria-label="`View forecast for ${location.name}`"
          >
            <div class="text-lg">{{ location.name }}</div>
            <div class="mt-1 line-clamp-2 opacity-80">
              {{ location.country }}{{ location.admin2 ? ', ' + location.admin2 : '' }}{{ location.admin1 ? ', ' + location.admin1 : '' }}
            </div>
          </button>
        </li>
      </ul>
    </section>
    <div class="xl:mx-auto xl:mt-12 xl:grid xl:max-w-7xl xl:grid-cols-[50rem_24rem] xl:gap-8">
      <div class="mt-8 xl:mt-0">
        <CurrentForecast :data="currentData" :activeResult="activeResult" />
        <DailyForecast :data="dailyData" />
      </div>
      <HourlyForecast :data="hourlyData" />
    </div>
  </main>
</template>
