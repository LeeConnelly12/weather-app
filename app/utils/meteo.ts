export async function fetchCoordsForLocation(location: string) {
  const url = 'https://geocoding-api.open-meteo.com/v1/search'

  const params = new URLSearchParams({
    name: location,
  })

  const { data } = await useFetch(url + '?' + params.toString())

  return data.value
}
