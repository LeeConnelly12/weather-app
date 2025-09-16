<script setup>
const emit = defineEmits(['selectedResult'])

const loading = ref(false)
const search = ref('')
const results = ref([])
const showResults = ref(false)

const submit = async () => {
  showResults.value = true

  loading.value = true

  const { data, error } = await fetchCoordsForLocation(search.value)

  if (error.value) {
    console.error(error.value)
    showResults.value = false
    loading.value = false
    return
  }

  loading.value = false

  results.value = data.value
}

const selectedResult = (result) => {
  search.value = ''

  showResults.value = false

  results.value = []

  emit('selectedResult', result)
}

const getFormattedNameForResult = (result) => {
  const parts = [result.name]

  if (result.admin2?.trim()) {
    parts.push(result.admin2)
  }

  if (result.admin1?.trim()) {
    parts.push(result.admin1)
  }

  parts.push(result.country)

  return parts.join(', ')
}
</script>

<template>
  <form @submit.prevent="submit" class="mt-12 items-center md:grid md:grid-cols-[1fr_auto] md:gap-4 xl:mx-auto xl:mt-16 xl:max-w-2xl">
    <div class="relative flex items-center">
      <IconSearch class="pointer-events-none absolute left-6" />
      <input
        v-model="search"
        type="search"
        placeholder="Search for a place..."
        required
        minlength="3"
        class="h-14 w-full rounded-xl bg-neutral-800 pl-[3.75rem] pr-6 text-white outline-none placeholder:text-neutral-200 focus:outline-2 focus:outline-white"
      />
      <ul
        v-if="showResults"
        class="absolute top-full z-10 mt-2 grid max-h-44 w-full gap-1 overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-800 p-2"
        tabindex="-1"
      >
        <li v-if="!loading" v-for="result in results" :key="result.id">
          <button
            type="button"
            class="w-full rounded-lg border border-transparent p-2 text-left outline-none hover:border-neutral-600 hover:bg-neutral-700 focus:border-neutral-600 focus:bg-neutral-700 focus:outline-2 focus:outline-white"
            @click="selectedResult(result)"
          >
            {{ getFormattedNameForResult(result) }}
          </button>
        </li>
        <li class="flex items-center gap-2.5 p-2" v-else>
          <IconLoadingSpinner />
          <p class="w-full rounded-lg border border-transparent text-left">Search in progress</p>
        </li>
      </ul>
    </div>
    <button
      type="submit"
      class="mt-3 h-14 w-full rounded-xl bg-blue-500 text-xl outline-none hover:bg-blue-700 focus:outline-2 focus:outline-blue-500 md:mt-0 md:px-6"
    >
      Search
    </button>
  </form>
</template>
