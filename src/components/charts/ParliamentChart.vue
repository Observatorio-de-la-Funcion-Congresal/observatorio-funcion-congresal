<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
    role="img"
    :aria-label="`Composición parlamentaria: ${totalSeats} escaños`"
    class="w-full h-auto"
  >
    <circle
      v-for="(point, i) in points"
      :key="i"
      :cx="point.cx"
      :cy="point.cy"
      :r="point.r"
      :fill="point.fill"
      :class="point.party"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { generatePoints, getViewBox } from '../../lib/parliament-layout.js'

interface SeatGroup {
  party: string
  count: number
  color: string
}

const props = defineProps<{
  seats: SeatGroup[]
}>()

const layout = computed(() => generatePoints(props.seats))

const points = computed(() => layout.value.points)

const viewBox = computed(() => getViewBox(layout.value.r0, layout.value.a))

const totalSeats = computed(() => props.seats.reduce((s, g) => s + g.count, 0))
</script>
