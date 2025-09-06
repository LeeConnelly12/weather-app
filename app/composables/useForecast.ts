import { addHours, format, startOfHour } from 'date-fns'

export function useForecast(daily: any, hourly: any, day: any) {
  const time = ref(new Date())

  const dailyForecast = computed(() => {
    if (!daily.value?.time) {
      return []
    }

    return daily.value.time.map((date: any) => {
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

    const startTime = startOfHour(time.value)
    const endTime = addHours(time.value, 8)

    return hourly.value.time
      .filter((date: any) => {
        const forecastDate = new Date(date)

        if (format(forecastDate, 'EEEE') !== day.value) {
          return false
        }

        return forecastDate >= startTime && forecastDate <= endTime
      })
      .map((date: any) => {
        const index = hourly.value.time.indexOf(date)

        return {
          temperature: Math.round(hourly.value.temperature_2m[index]) + '°',
          time: format(date, 'h a'),
          weatherCode: hourly.value.weather_code[index],
        }
      })
  })

  return {
    dailyForecast,
    hourlyForecast,
  }
}
