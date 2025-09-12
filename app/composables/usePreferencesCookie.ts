interface Preferences {
  isMetric: boolean
  temperature: 'metric' | 'imperial'
  windSpeed: 'metric' | 'imperial'
  precipitation: 'metric' | 'imperial'
}

export function usePreferencesCookie() {
  return useCookie<Preferences>('preferences', {
    default: () => ({
      isMetric: true,
      temperature: 'metric',
      windSpeed: 'metric',
      precipitation: 'metric',
    }),
  })
}
