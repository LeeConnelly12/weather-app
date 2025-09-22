<script setup>
import { format } from 'date-fns'

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})

const loading = useState('loading')

const dailyForecast = computed(() => {
  if (!props.data?.time) {
    return []
  }

  return props.data.time.map((date) => {
    const index = props.data.time.indexOf(date)

    return {
      day: format(date, 'EEE'),
      min: Math.round(props.data.temperature_2m_min[index]) + '°',
      max: Math.round(props.data.temperature_2m_max[index]) + '°',
      weatherCode: props.data.weather_code[index],
    }
  })
})
</script>

<template>
  <section v-if="!loading && dailyForecast.length" class="mt-8 xl:mt-[3.75rem]">
    <h2 class="text-xl font-semibold">Daily forecast</h2>
    <ul class="mt-5 grid grid-cols-[repeat(auto-fit,minmax(89px,1fr))] gap-4">
      <li v-for="forecast in dailyForecast" :key="forecast.day" class="rounded-xl border border-neutral-600 bg-neutral-800 px-2.5 py-4 text-center">
        <h3 class="text-lg">{{ forecast.day }}</h3>
        <WeatherCode :weatherCode="forecast.weatherCode" class="mt-4 inline-block" width="60" height="60" />
        <div class="mt-4 flex justify-between">
          <div>
            <span class="sr-only">Minimum temperature: </span>
            <span>{{ forecast.min }}</span>
          </div>
          <div class="text-neutral-200">
            <span class="sr-only">Maximum temperature: </span>
            <span>{{ forecast.max }}</span>
          </div>
        </div>
      </li>
    </ul>
  </section>
  <div v-if="loading" class="mt-8 xl:mt-[3.75rem]">
    <h2 class="text-xl font-semibold">Daily forecast</h2>
    <ul class="mt-5 grid grid-cols-[repeat(auto-fit,minmax(89px,1fr))] gap-4">
      <li v-for="day in 7" :key="day" class="h-[167px] rounded-xl border border-neutral-600 bg-neutral-800 px-2.5 py-4 text-center"></li>
    </ul>
  </div>
</template>
