<template>
  <div class="relative w-full h-56">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const props = defineProps<{
  attendance: number
  accomplishment: number
  projects: number
}>()

const chartData = computed(() => ({
  labels: ['Asistencia', 'Cumplimiento', 'Proyectos'],
  datasets: [
    {
      data: [props.attendance, props.accomplishment, props.projects],
      backgroundColor: ['#166534', '#15803D', '#4ADE80'],
      borderRadius: 6,
      borderSkipped: false,
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
        label: (ctx: { raw: unknown; label: string }) => {
          const val = ctx.raw as number
          return ctx.label === 'Proyectos' ? ` ${val} proyectos` : ` ${val}%`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#4A5565', font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#4A5565',
        font: { size: 11 },
      },
    },
  },
}
</script>
