<script setup>
const activeResult = ref(null)

const loading = useState('loading', () => false)

const locationCookie = useCookie('location')

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
    locationCookie.value = {
      name: data.value.city,
      country: data.value.country_name,
      admin1: data.value.region_name,
      latitude: data.value.latitude,
      longitude: data.value.longitude,
    }

    await setPlace({
      name: data.value.city,
      country: data.value.country_name,
      admin1: data.value.region_name,
      latitude: data.value.latitude,
      longitude: data.value.longitude,
    })
  }
})
</script>

<template>
  <Nav />
  <main class="mt-12 xl:mt-16">
    <h1 class="text-center font-bricolage-grotesque text-6xl font-bold md:mx-auto md:max-w-lg xl:max-w-none">How's the sky looking today?</h1>
    <SearchForm @selectedResult="setPlace" />
    <div class="xl:mx-auto xl:mt-12 xl:grid xl:max-w-7xl xl:grid-cols-[50rem_24rem] xl:gap-8">
      <div class="mt-8 xl:mt-0">
        <CurrentForecast :data="currentData" :activeResult="activeResult" />
        <DailyForecast :data="dailyData" />
      </div>
      <HourlyForecast :data="hourlyData" />
    </div>
  </main>
</template>
