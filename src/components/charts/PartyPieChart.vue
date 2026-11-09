<template>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
    <div class="relative w-52 h-52 sm:w-60 sm:h-60 shrink-0">
      <Pie :data="chartData" :options="chartOptions" :plugins="[sliceLabels]" />
    </div>
    <ul class="flex flex-col gap-1.5 text-xs">
      <li
        v-for="item in composition"
        :key="item.party"
        class="flex items-center justify-between gap-6"
      >
        <span class="flex items-center gap-2 text-primary-gray-obs">
          <span
            class="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            :style="{ backgroundColor: item.color }"
          ></span>
          {{ item.party }}
        </span>
        <span
          v-if="showSeatsInLegend"
          class="font-semibold"
          :style="{ color: item.color }"
        >{{ item.seats }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip)

interface CompositionItem {
  party: string
  color: string
  seats: number
}

const props = withDefaults(
  defineProps<{ composition: CompositionItem[]; showSeatsInLegend?: boolean }>(),
  { showSeatsInLegend: false },
)

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

// Draws the seat count inside each slice, using dark text on light slices.
const sliceLabels = {
  id: 'sliceLabels',
  afterDatasetsDraw(chart: ChartJS) {
    const { ctx } = chart
    const meta = chart.getDatasetMeta(0)
    const values = chart.data.datasets[0].data as number[]
    const colors = chart.data.datasets[0].backgroundColor as string[]
    ctx.save()
    ctx.font = '600 11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    meta.data.forEach((arc, i) => {
      const { x, y } = arc.tooltipPosition(false)
      ctx.fillStyle = isLight(colors[i]) ? '#191308' : '#FFFFFF'
      ctx.fillText(String(values[i]), x, y)
    })
    ctx.restore()
  },
}

function isLight(hex: string): boolean {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 160
}

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
