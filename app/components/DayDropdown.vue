<script setup>
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const selectedDay = useModel(props, 'modelValue')

const open = ref(false)

const ignoreElRef = useTemplateRef('ignoreElRef')

watch(selectedDay, () => (open.value = false))
</script>

<template>
  <div class="relative">
    <button
      ref="ignoreElRef"
      @click="open = !open"
      type="button"
      class="flex items-center gap-1.5 rounded-md bg-neutral-600 px-4 py-2 outline-none focus:outline-2 focus:outline-white"
      :aria-expanded="open"
      aria-label="Select day of week"
    >
      {{ loading ? '&ndash;' : selectedDay }}
      <IconChevron :class="{ 'rotate-180': open }" />
    </button>
    <ul
      v-if="open"
      v-on-click-outside="[() => (open = false), { ignore: [ignoreElRef] }]"
      class="absolute right-0 top-full z-10 mt-2.5 w-[13.375rem] space-y-1 rounded-xl border border-neutral-600 bg-neutral-800 px-2 py-1.5"
      @keydown.escape="open = false"
    >
      <li v-for="day in days" :key="day">
        <label
          class="block cursor-pointer rounded-lg px-2 py-2.5 outline-none hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-2 focus:outline-white"
          :class="{ 'bg-neutral-700': day === selectedDay }"
          tabindex="0"
          @keydown.enter.prevent="selectedDay = day"
          @keydown.space.prevent="selectedDay = day"
        >
          <input v-model="selectedDay" type="radio" :value="day" class="hidden" />
          {{ day }}
        </label>
      </li>
    </ul>
  </div>
</template>
