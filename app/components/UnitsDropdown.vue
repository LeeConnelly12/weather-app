<script setup>
import { vOnClickOutside } from '@vueuse/components'

const preferences = usePreferencesCookie()

const open = ref(false)

const ignoreElRef = useTemplateRef('ignoreElRef')

const switchUnits = () => {
  if (preferences.value.isMetric) {
    preferences.value = {
      ...preferences.value,
      isMetric: false,
      temperature: 'imperial',
      windSpeed: 'imperial',
      precipitation: 'imperial',
    }
  } else {
    preferences.value = {
      ...preferences.value,
      isMetric: true,
      temperature: 'metric',
      windSpeed: 'metric',
      precipitation: 'metric',
    }
  }
}
</script>

<template>
  <div class="relative">
    <button
      ref="ignoreElRef"
      @click="open = !open"
      type="button"
      class="flex items-center gap-1.5 rounded-md bg-neutral-800 px-2.5 py-2 text-sm outline-none focus:outline-2 focus:outline-white md:gap-2"
      :aria-expanded="open"
      aria-label="Switch temperature units"
    >
      <IconUnits />
      Units
      <IconChevron :class="{ 'rotate-180': open }" />
    </button>
    <ul
      v-if="open"
      v-on-click-outside="[() => (open = false), { ignore: [ignoreElRef] }]"
      class="absolute right-0 top-full z-10 mt-2.5 w-[13.375rem] rounded-xl border border-neutral-600 bg-neutral-800 px-2 py-1.5"
      @keydown.escape="open = false"
      role="menu"
    >
      <li role="menuitem">
        <button
          type="button"
          @click="switchUnits"
          class="w-full rounded-lg px-2 py-2.5 text-left outline-none hover:bg-neutral-700 focus:outline-2 focus:outline-white"
        >
          <template v-if="preferences.isMetric">Switch to Imperial</template>
          <template v-else>Switch to Metric</template>
        </button>
      </li>
      <li class="mt-2.5">
        <fieldset>
          <legend class="pl-2 text-sm text-neutral-300">Temperature unit</legend>
          <label
            class="mt-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left outline-none focus-within:outline-2 focus-within:outline-white hover:bg-neutral-700"
            :class="{ 'bg-neutral-700': preferences.temperature === 'metric' }"
          >
            <input v-model="preferences.temperature" type="radio" name="temperature" class="sr-only" value="metric" />
            Celsius (°C)
            <IconCheckMark v-if="preferences.temperature === 'metric'" />
          </label>
          <label
            class="mt-1.5 flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left outline-none focus-within:outline-2 focus-within:outline-white hover:bg-neutral-700"
            :class="{ 'bg-neutral-700': preferences.temperature === 'imperial' }"
          >
            <input v-model="preferences.temperature" type="radio" name="temperature" class="sr-only" value="imperial" />
            Fahrenheit (°F)
            <IconCheckMark v-if="preferences.temperature === 'imperial'" />
          </label>
        </fieldset>
      </li>
      <li class="mt-1 border-t border-t-neutral-600 pt-2.5">
        <fieldset>
          <legend class="pl-2 text-sm text-neutral-300">Wind speed unit</legend>
          <label
            class="mt-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left outline-none focus-within:outline-2 focus-within:outline-white hover:bg-neutral-700"
            :class="{ 'bg-neutral-700': preferences.windSpeed === 'metric' }"
          >
            <input v-model="preferences.windSpeed" type="radio" name="windSpeed" class="sr-only" value="metric" />
            km/h
            <IconCheckMark v-if="preferences.windSpeed === 'metric'" />
          </label>
          <label
            class="mt-1.5 flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left outline-none focus-within:outline-2 focus-within:outline-white hover:bg-neutral-700"
            :class="{ 'bg-neutral-700': preferences.windSpeed === 'imperial' }"
          >
            <input v-model="preferences.windSpeed" type="radio" name="windSpeed" class="sr-only" value="imperial" />
            mph
            <IconCheckMark v-if="preferences.windSpeed === 'imperial'" />
          </label>
        </fieldset>
      </li>
      <li class="mt-1 border-t border-t-neutral-600 pt-2.5">
        <fieldset>
          <legend class="pl-2 text-sm text-neutral-300">Precipitation unit</legend>
          <label
            class="mt-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left outline-none focus-within:outline-2 focus-within:outline-white hover:bg-neutral-700"
            :class="{ 'bg-neutral-700': preferences.precipitation === 'metric' }"
          >
            <input v-model="preferences.precipitation" type="radio" name="precipitation" class="sr-only" value="metric" />
            Millimeters (mm)
            <IconCheckMark v-if="preferences.precipitation === 'metric'" />
          </label>
          <label
            class="mt-1.5 flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left outline-none focus-within:outline-2 focus-within:outline-white hover:bg-neutral-700"
            :class="{ 'bg-neutral-700': preferences.precipitation === 'imperial' }"
          >
            <input v-model="preferences.precipitation" type="radio" name="precipitation" class="sr-only" value="imperial" />
            Inches (in)
            <IconCheckMark v-if="preferences.precipitation === 'imperial'" />
          </label>
        </fieldset>
      </li>
    </ul>
  </div>
</template>
