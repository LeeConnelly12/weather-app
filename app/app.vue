<script setup>
useHead({
  title: 'Weather App',
  bodyAttrs: {
    class: 'bg-neutral-900 text-white',
  },
})

const search = useState('search', () => '')

const results = useState('results', () => [])

const submit = async () => {
  const response = await fetchCoordsForLocation(search.value)

  results.value = response.results
}
</script>

<template>
  <div>
    <h1>How's the sky looking today?</h1>
    <form @submit.prevent="submit">
      <input v-model="search" type="text" class="text-black" placeholder="Search for a place..." />
      <button type="submit">Search</button>
    </form>
    <ul v-if="results.length">
      <li v-for="result in results" :key="result.id">
        <button type="button">
          {{ result.name }}
        </button>
      </li>
    </ul>
  </div>
</template>
