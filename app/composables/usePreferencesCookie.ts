interface Preferences {
  isMetric: boolean
  temperature: 'metric' | 'imperial'
  windSpeed: 'metric' | 'imperial'
  precipitation: 'metric' | 'imperial'
  name: string | null
  admin1: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
}

export function usePreferencesCookie() {
  return useCookie<Preferences>('preferences', {
    default: () => ({
      isMetric: true,
      temperature: 'metric',
      windSpeed: 'metric',
      precipitation: 'metric',
      name: null,
      admin1: null,
      country: null,
      latitude: null,
      longitude: null,
    }),
  })
}
