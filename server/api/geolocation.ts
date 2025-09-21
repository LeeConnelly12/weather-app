import { createError, defineEventHandler, getCookie, getHeaders } from 'h3'

export default defineEventHandler(async (event) => {
  const location = getCookie(event, 'preferences')

  if (location && typeof location === 'string') {
    const json = JSON.parse(location)

    if (json.latitude && json.longitude) {
      return JSON.parse(location)
    }
  }

  const headers = getHeaders(event)

  let clientIp = headers['x-forwarded-for'] || headers['x-real-ip'] || headers['x-client-ip'] || event.node.req.socket.remoteAddress

  if (clientIp?.includes(',')) {
    clientIp = clientIp.split(',')[0].trim()
  }

  // Fallback for local environment
  if (clientIp === '::1' || clientIp === '127.0.0.1' || !clientIp) {
    return {
      name: 'Mountain View',
      admin1: 'California',
      country: 'United States',
      latitude: 37.42301,
      longitude: -122.083352,
    }
  }

  try {
    const response = await $fetch(`http://ip-api.com/json/${clientIp}`, {
      timeout: 2000,
    })

    return {
      name: response.city,
      admin1: response.regionName,
      country: response.country,
      latitude: response.lat,
      longitude: response.lon,
    }
  } catch (error) {
    console.error('Failed geolocation for IP', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed geolocation for IP',
    })
  }
})
