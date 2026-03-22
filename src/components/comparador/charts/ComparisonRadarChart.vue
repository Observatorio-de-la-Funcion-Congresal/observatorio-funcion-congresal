<template>
  <div class="relative w-full h-72">
    <Radar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface Dataset {
  label: string
  data: number[]
  color: string
}

const props = defineProps<{
  labels: string[]
  datasets: Dataset[]
}>()

// Build a semi-transparent fill color from a hex color
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((d) => ({
    label: d.label,
    data: d.data,
    backgroundColor: hexToRgba(d.color, 0.2),
    borderColor: d.color,
    borderWidth: 2,
    pointBackgroundColor: d.color,
    pointRadius: 4,
    fill: true,
  })),
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: { display: false, stepSize: 25 },
      grid: { color: '#e2e8f0' },
      pointLabels: { color: '#4A5565', font: { size: 10 } },
    },
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { font: { size: 11 }, color: '#4A5565', boxWidth: 12, padding: 12 },
    },
    tooltip: {
      callbacks: {
        label: (ctx: { dataset: { label?: string }; raw: unknown }) =>
          ` ${ctx.dataset.label}: ${ctx.raw}%`,
      },
    },
  },
}
</script>
