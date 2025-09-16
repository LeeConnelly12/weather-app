<script setup>
import { format } from 'date-fns'

const props = defineProps({
  dailyData: {
    type: Object,
    default: () => {},
  },
})

const loading = useState('loading')

const dailyForecast = computed(() => {
  if (!props.dailyData?.time) {
    return []
  }

  return props.dailyData.time.map((date) => {
    const index = props.dailyData.time.indexOf(date)

    return {
      day: format(date, 'EEE'),
      min: Math.round(props.dailyData.temperature_2m_min[index]) + '°',
      max: Math.round(props.dailyData.temperature_2m_max[index]) + '°',
      weatherCode: props.dailyData.weather_code[index],
    }
  })
})
</script>

<template>
  <section v-if="!loading && dailyForecast.length" class="mt-8 xl:mt-[3.75rem]">
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
  <div v-if="loading" class="mt-8 xl:mt-[3.75rem]">
    <h2 class="text-xl font-semibold">Daily forecast</h2>
    <ul class="mt-5 grid grid-cols-[repeat(auto-fit,minmax(89px,1fr))] gap-4">
      <li v-for="day in 7" :key="day" class="h-[167px] rounded-xl border border-neutral-600 bg-neutral-800 px-2.5 py-4 text-center"></li>
    </ul>
  </div>
</template>
