import { defineEventHandler, getHeaders } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const headers = getHeaders(event)

  let clientIp = headers['x-forwarded-for'] || headers['x-real-ip'] || headers['x-client-ip'] || event.node.req.socket.remoteAddress

  if (clientIp?.includes(',')) {
    clientIp = clientIp.split(',')[0].trim()
  }

  // Fallback for local environment
  if (clientIp === '::1' || clientIp === '127.0.0.1' || !clientIp) {
    return {
      city: 'Mountain View',
      region_name: 'California',
      country_name: 'United States',
      latitude: 37.42301,
      longitude: -122.083352,
    }
  }

  try {
    const response = await $fetch(`https://api.ipapi.com/api/${clientIp}`, {
      query: {
        access_key: config.apiAccessKey,
      },
    })

    return {
      city: response.city,
      region_name: response.region_name,
      country_name: response.country_name,
      latitude: response.latitude,
      longitude: response.longitude,
    }
  } catch (error) {
    console.error('Failed geolocation for IP', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed geolocation for IP',
    })
  }
})
