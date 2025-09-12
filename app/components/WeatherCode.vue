<script setup>
defineProps({
  weatherCode: Number,
})

const path = {
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  56: 'drizzle',
  57: 'drizzle',
  45: 'fog',
  48: 'fog',
  3: 'overcast',
  1: 'partly-cloudy',
  2: 'partly-cloudy',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'rain',
  67: 'rain',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  85: 'snow',
  86: 'snow',
  95: 'storm',
  96: 'storm',
  99: 'storm',
  0: 'sunny',
}

const altText = {
  'drizzle': 'Drizzle',
  'fog': 'Fog',
  'overcast': 'Overcast',
  'partly-cloudy': 'Partly cloudy',
  'rain': 'Rain',
  'snow': 'Snow',
  'storm': 'Storm',
  'sunny': 'Sunny',
}
</script>

<template>
  <img :src="`/images/icon-${path[weatherCode]}.webp`" :alt="altText[path[weatherCode]]" width="320" height="320" />
</template>
