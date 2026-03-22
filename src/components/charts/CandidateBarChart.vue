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
  session_week: number
}>()

const chartData = computed(() => ({
  labels: ['Asistencia', 'Cumplimiento', 'Semana Rep.'],
  datasets: [
    {
      data: [props.attendance, props.accomplishment, props.session_week],
      backgroundColor: ['#023E7D', '#1C398E', '#103a82'],
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
        label: (ctx: { raw: unknown }) => ` ${ctx.raw}%`,
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
      max: 100,
      grid: { color: '#f1f5f9' },
      ticks: { color: '#4A5565', font: { size: 11 }, callback: (v: unknown) => `${v}%` },
    },
  },
}
</script>
