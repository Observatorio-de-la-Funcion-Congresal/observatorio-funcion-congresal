<template>
  <div class="relative w-full h-64">
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
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface MonthlyBills {
  month: string
  deputies: number
  senate: number
}

const props = defineProps<{ data: MonthlyBills[] }>()

const chartData = computed(() => ({
  labels: props.data.map((d) => d.month),
  datasets: [
    {
      label: 'Diputados',
      data: props.data.map((d) => d.deputies),
      backgroundColor: '#023E7D',
      borderRadius: 4,
      borderSkipped: false,
    },
    {
      label: 'Senado',
      data: props.data.map((d) => d.senate),
      backgroundColor: '#D62828',
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: { size: 11 },
        color: '#4A5565',
        boxWidth: 12,
        padding: 12,
      },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, ticks: { precision: 0 } },
  },
}
</script>
