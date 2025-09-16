<script setup>
import { format, getHours, startOfHour } from 'date-fns'

const props = defineProps({
  hourlyData: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const selectedDay = ref(format(new Date(), 'EEEE'))

const hourlyForecast = computed(() => {
  if (!props.hourlyData?.time) {
    return []
  }

  const startTime = startOfHour(new Date())

  return props.hourlyData.time
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
      const index = props.hourlyData.time.indexOf(date)

      return {
        temperature: Math.round(props.hourlyData.temperature_2m[index]) + '°',
        isoTime: format(date, 'HH:mm'),
        time: format(date, 'h a'),
        weatherCode: props.hourlyData.weather_code[index],
      }
    })
})
</script>

<template>
  <section
    v-if="!loading && hourlyForecast.length"
    class="mt-8 max-h-[709px] overflow-y-scroll rounded-xl bg-neutral-800 px-4 pb-5 md:px-6 md:pb-6 xl:mt-0"
  >
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
  <div v-if="loading" class="mt-8 max-h-[709px] overflow-y-scroll rounded-xl bg-neutral-800 px-4 pb-5 md:px-6 md:pb-6 xl:mt-0">
    <div class="sticky top-0 flex items-center justify-between bg-neutral-800 pb-4 pt-5 md:pt-6">
      <h2 class="text-xl font-semibold">Hourly forecast</h2>
      <DayDropdown v-model="selectedDay" :loading="loading" />
    </div>
    <div class="space-y-4">
      <Skeleton v-for="hour in 8" :key="hour" class="h-[62px] rounded-lg border border-neutral-600 bg-neutral-700 py-2.5 pl-3 pr-4" />
    </div>
  </div>
</template>
