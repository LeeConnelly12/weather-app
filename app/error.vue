<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <Nav />
  <main class="mt-12 text-center sm:pt-10 xl:mt-16">
    <Error class="inline-block" />
    <h1 class="mt-6 font-bricolage-grotesque text-6xl font-bold md:mx-auto md:max-w-lg xl:max-w-none">Something went wrong</h1>
    <p class="mx-auto mt-6 max-w-[34rem] text-xl font-bold text-neutral-200">
      We couldn't connect to the server (API error). Please try again in a few moments.
    </p>
    <NuxtLink
      to="/"
      class="mt-6 inline-flex items-center gap-2.5 rounded-lg bg-neutral-800 px-4 py-3 outline-none hover:bg-neutral-700 focus:outline-2 focus:outline-white"
    >
      <Switch />
      Retry
    </NuxtLink>
  </main>
</template>
