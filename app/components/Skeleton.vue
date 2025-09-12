<script setup>
const props = defineProps({
  class: String,
})

const skeletonClass = computed(() => ['custom-pulse rounded-md bg-gray-200 dark:bg-gray-700', props.class])
</script>

<template>
  <div :class="skeletonClass" v-bind="$attrs">
    <slot />
  </div>
</template>
