<template>
  <div class="flex flex-col sm:flex-row items-center gap-6">
    <div class="relative w-48 h-48 shrink-0">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <ul class="flex flex-col gap-2 w-full">
      <li
        v-for="item in composition"
        :key="item.party"
        class="flex items-center justify-between gap-3 text-sm"
      >
        <span class="flex items-center gap-2 text-primary-gray-obs">
          <span
            class="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            :style="{ backgroundColor: item.color }"
          ></span>
          {{ item.party }}
        </span>
        <span class="font-semibold" :style="{ color: item.color }">{{ item.seats }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip)

interface CompositionItem {
  party: string
  color: string
  seats: number
}

const props = defineProps<{ composition: CompositionItem[] }>()

const chartData = computed(() => ({
  labels: props.composition.map((d) => d.party),
  datasets: [
    {
      data: props.composition.map((d) => d.seats),
      backgroundColor: props.composition.map((d) => d.color),
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { label: string; raw: unknown }) =>
          ` ${ctx.label}: ${ctx.raw} escaños`,
      },
    },
  },
}
</script>
