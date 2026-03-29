<template>
  <div class="relative w-full h-64">
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
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  session_week_percentage: number
  projects_percentage: number
  accomplishment_percentage: number
  vote_priorities_percentage: number
  motions_percentage: number
}>()

const chartData = computed(() => ({
  labels: [
    '% Sem. representación', 
    '% Proyectos aprobados', 
    '% Cumplimiento promesas', 
    '% Votación a favor', 
    '% Mociones aprobadas'
  ],
  datasets: [
    {
      data: [
        props.session_week_percentage,
        props.projects_percentage,
        props.accomplishment_percentage,
        props.vote_priorities_percentage,
        props.motions_percentage,
      ],
      backgroundColor: 'rgba(214, 40, 40, 0.25)',
      borderColor: '#D62828',
      borderWidth: 2,
      pointBackgroundColor: '#D62828',
      pointRadius: 4,
      fill: true,
    },
  ],
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
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { raw: unknown; label: string }) => ` ${ctx.label}: ${ctx.raw}%`,
      },
    },
  },
}
</script>
