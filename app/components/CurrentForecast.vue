<script setup>
import { format } from 'date-fns'

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  activeResult: {
    type: Object,
    default: () => {},
  },
})

const preferences = usePreferencesCookie()

const loading = useState('loading')

const formattedPlace = computed(() => {
  if (!props.data) {
    return null
  }

  if (!props.activeResult) {
    return null
  }

  return {
    date: format(new Date(), 'EEEE, MMM d, yyyy'),
    isoDate: format(new Date(), 'Y-mm-dd'),
    name: props.activeResult.name + ', ' + props.activeResult.country,
    feelsLike: Math.round(props.data.apparent_temperature) + '°',
    humidity: props.data.relative_humidity_2m + '%',
    precipitation:
      preferences.value.precipitation === 'imperial'
        ? Math.round(props.data.precipitation / 25.4) + ' in'
        : Math.round(props.data.precipitation) + ' mm',
    temperature: Math.round(props.data.temperature_2m) + '°',
    weatherCode: props.data.weather_code,
    wind:
      preferences.value.windSpeed === 'imperial'
        ? Math.round(props.data.wind_speed_10m * 2.23694) + ' mph'
        : Math.round(props.data.wind_speed_10m * 3.6) + ' km/h',
  }
})
</script>

<template>
  <template v-if="!loading && formattedPlace">
    <section
      class="h-[286px] w-full rounded-[1.25rem] bg-today-small bg-cover bg-no-repeat py-10 text-center md:flex md:items-center md:justify-between md:bg-today-large md:px-6 md:text-left"
    >
      <div>
        <h2 class="text-3xl font-bold">{{ formattedPlace.name }}</h2>
        <time :datetime="formattedPlace.isoDate" class="mt-3 text-lg opacity-80">{{ formattedPlace.date }}</time>
      </div>
      <div class="mt-4 inline-flex items-center gap-5 md:mt-0">
        <WeatherCode :weatherCode="formattedPlace.weatherCode" width="120" height="120" />
        <span class="sr-only">Current temperature: </span>
        <span class="text-8xl italic">{{ formattedPlace.temperature }}</span>
      </div>
    </section>
    <section class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 xl:mt-8 xl:gap-6">
      <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
        <dt class="text-lg text-neutral-200">Feels Like</dt>
        <dd class="mt-6 text-4xl font-light">{{ formattedPlace.feelsLike }}</dd>
      </div>
      <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
        <dt class="text-lg text-neutral-200">Humidity</dt>
        <dd class="mt-6 text-4xl font-light">{{ formattedPlace.humidity }}</dd>
      </div>
      <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
        <dt class="text-lg text-neutral-200">Wind</dt>
        <dd class="mt-6 text-4xl font-light">{{ formattedPlace.wind }}</dd>
      </div>
      <div class="rounded-xl border border-neutral-600 bg-neutral-800 p-5">
        <dt class="text-lg text-neutral-200">Precipitation</dt>
        <dd class="mt-6 text-4xl font-light">{{ formattedPlace.precipitation }}</dd>
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
</template>
