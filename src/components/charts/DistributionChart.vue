<template>
  <div class="relative w-full h-56">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DistributionItem {
  name: string
  value: number
}

const props = defineProps<{ distribution: DistributionItem[] }>()

const COLORS = ['#023E7D', '#D62828', '#7C3AED', '#059669', '#D97706']

const chartData = computed(() => ({
  labels: props.distribution.map((d) => d.name),
  datasets: [
    {
      data: props.distribution.map((d) => d.value),
      backgroundColor: props.distribution.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 0,
      hoverOffset: 6,
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
    tooltip: {
      callbacks: {
        label: (ctx: { label: string; raw: unknown }) =>
          ` ${ctx.label}: ${ctx.raw}%`,
      },
    },
  },
}
</script>
