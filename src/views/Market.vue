<template>
  <div class="w-screen h-screen overflow-y-auto overflow-x-hidden">
    <div
      class="p-6 w-screen h-max my-8 flex flex-col lg:flex-row justify-center gap-4"
    >
      <div class="max-w-xl flex-grow h-max p-6 rounded-lg lining-nums">
        <div class="mb-4">
          <p class="text-sm text-white">Daily active users</p>
          <h2 class="text-2xl font-bold text-white">
            {{ formatValue(values?.[values.length - 1]) ?? 0 }}K
          </h2>
        </div>
        <div class="h-80 relative">
          <Line
            :data="chartData"
            :options="chartOptions"
            @mouseenter="onChartEnter"
            @mouseleave="onChartLeave"
          />
        </div>
      </div>

      <div class="max-w-xl flex-grow 6 h-max p-6 rounded-lg lining-nums">
        <div class="mb-4">
          <p class="text-sm text-white">Volume in RampX</p>
          <h2 class="text-2xl font-bold text-white">
            ${{ formatValue(values?.[values.length - 1]) ?? 0 }}M
          </h2>
        </div>
        <div class="h-80 relative">
          <Line
            :data="chartData"
            :options="chartOptions"
            @mouseenter="onChartEnter"
            @mouseleave="onChartLeave"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
)

// Generate fake data
const generateData = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const values = [
    { time: '2024-01-01', value: 13.45 },
    { time: '2024-01-02', value: 20.12 },
    { time: '2024-01-03', value: 24.5 },
    { time: '2024-01-04', value: 24.75 },
    { time: '2024-01-05', value: 25.32 },
    { time: '2024-01-06', value: 26.18 },
    { time: '2024-01-07', value: 33.05 },
    { time: '2024-01-08', value: 44.72 },
    { time: '2024-01-09', value: 52.95 },
    { time: '2024-01-10', value: 66.6 },
    { time: '2024-01-11', value: 54.13 },
    { time: '2024-01-12', value: 59.92 },
    { time: '2024-01-13', value: 70.63 },
    { time: '2024-01-14', value: 80.8 },
    { time: '2024-01-15', value: 90.45 },
    { time: '2024-01-16', value: 105.9 },
    { time: '2024-01-17', value: 85.32 },
    { time: '2024-01-18', value: 87.25 },
    { time: '2024-01-19', value: 95.37 },
    { time: '2024-01-20', value: 70.7 },
    { time: '2024-01-21', value: 75.02 },
    { time: '2024-01-22', value: 65.28 },
    { time: '2024-01-23', value: 60.23 },
    { time: '2024-01-24', value: 55.61 },
    { time: '2024-01-25', value: 50.19 },
    { time: '2024-01-26', value: 45.52 },
    { time: '2024-01-27', value: 40.17 },
    { time: '2024-01-28', value: 37.15 },
    { time: '2024-01-29', value: 41.86 },
    { time: '2024-01-30', value: 37.42 },
    { time: '2024-01-31', value: 35.11 },
    { time: '2024-02-01', value: 33.08 },
    { time: '2024-02-02', value: 35.41 },
    { time: '2024-02-03', value: 31.4 },
    { time: '2024-02-04', value: 28.21 },
    { time: '2024-02-05', value: 33.04 },
    { time: '2024-02-06', value: 37.66 },
    { time: '2024-02-07', value: 40.51 },
    { time: '2024-02-08', value: 36.33 },
    { time: '2024-02-09', value: 35.99 },
    { time: '2024-02-10', value: 34.94 },
    { time: '2024-02-11', value: 34.98 },
    { time: '2024-02-12', value: 32.41 },
    { time: '2024-02-13', value: 32.36 },
    { time: '2024-02-14', value: 28.79 },
    { time: '2024-02-15', value: 32.58 },
    { time: '2024-02-16', value: 29.95 },
    { time: '2024-02-17', value: 34.46 },
    { time: '2024-02-18', value: 37.9 },
    { time: '2024-02-19', value: 34.89 },
    { time: '2024-02-20', value: 35.21 },
    { time: '2024-02-21', value: 35.89 },
    { time: '2024-02-22', value: 35.57 },
    { time: '2024-02-23', value: 33.64 },
    { time: '2024-02-24', value: 35.94 },
    { time: '2024-02-25', value: 36.52 },
    { time: '2024-02-26', value: 36.37 },
    { time: '2024-02-27', value: 40.43 },
    { time: '2024-02-28', value: 39.95 },
    { time: '2024-03-01', value: 35.53 },
    { time: '2024-03-02', value: 33.48 },
    { time: '2024-03-03', value: 36.96 },
    { time: '2024-03-04', value: 34.4 },
    { time: '2024-03-05', value: 34.33 },
    { time: '2024-03-06', value: 38.49 },
    { time: '2024-03-07', value: 42.7 },
    { time: '2024-03-08', value: 42.13 },
    { time: '2024-03-09', value: 42.08 },
    { time: '2024-03-10', value: 42.66 },
    { time: '2024-03-11', value: 45.71 },
    { time: '2024-03-12', value: 42.49 },
    { time: '2024-03-13', value: 41.65 },
    { time: '2024-03-14', value: 39.37 },
    { time: '2024-03-15', value: 37.19 },
    { time: '2024-03-16', value: 37.93 },
    { time: '2024-03-17', value: 40.07 },
    { time: '2024-03-18', value: 36.35 },
    { time: '2024-03-19', value: 37.26 },
    { time: '2024-03-20', value: 41.41 },
    { time: '2024-03-21', value: 39.42 },
    { time: '2024-03-22', value: 39.48 },
    { time: '2024-03-23', value: 36.7 },
    { time: '2024-03-24', value: 32.68 },
    { time: '2024-03-25', value: 29.23 },
    { time: '2024-03-26', value: 26.83 },
    { time: '2024-03-27', value: 28.85 },
    { time: '2024-03-28', value: 3.51 },
    { time: '2024-03-29', value: 2.11 },
    { time: '2024-03-30', value: 7.02 },
    { time: '2024-04-01', value: 3.32 },
    { time: '2024-04-02', value: 5.17 },
    { time: '2024-04-03', value: 13.89 },
    { time: '2024-04-04', value: 8.46 },
    { time: '2024-04-05', value: 9.92 },
    { time: '2024-04-06', value: 12.68 },
    { time: '2024-04-07', value: 6.67 },
  ]

  return {
    labels: values.map(({ time }) => `${time.split('-')[1]}/2024`),
    values: values.map(value => value.value * 1000000),
  }
}

const formatValue = (value: number): string => {
  return (value / 1000000).toFixed(2)
}

const { labels, values } = generateData()

const chartData = ref<ChartData<'line'>>({
  labels,
  datasets: [
    {
      label: 'TVL',
      data: values,
      fill: true,
      borderColor: 'rgb(208, 246, 3)',
      backgroundColor: 'rgb(208, 246, 3)',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: 'rgb(236, 252, 203)',
      pointHoverBorderColor: 'rgb(236, 252, 203)',
    },
  ],
})

const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'rgb(156, 163, 175)',
      bodyColor: 'white',
      padding: 12,
      borderColor: 'rgb(75, 85, 99)',
      borderWidth: 1,
      callbacks: {
        label: (context: any) => {
          return `$${formatValue(context.raw)}M`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        // color: 'rgb(156, 163, 175)',
        maxTicksLimit: 7,
        align: 'center',
        includeBounds: true,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        // color: 'rgba(75, 85, 99, 0.2)',
      },
      ticks: {
        // color: 'rgb(156, 163, 175)',
        callback: (value: any) => '',
      },
      border: {
        display: false,
      },
    },
  },
})

// Optional: Add hover effects
const onChartEnter = () => {
  // chartData.value.datasets[0].backgroundColor = 'rgba(0, 0, 0, 0)'

  const oldData = chartData.value
  oldData.datasets[0].pointHoverRadius = 6
  // chartData.value.datasets[0].backgroundColor = 'rgb(208, 246, 3)'
  oldData.datasets[0].fill = false

  chartData.value = oldData
}

const onChartLeave = () => {
  const oldData = chartData.value
  oldData.datasets[0].pointHoverRadius = 4
  // chartData.value.datasets[0].backgroundColor = 'rgb(208, 246, 3)'
  oldData.datasets[0].fill = true

  chartData.value = oldData
}
</script>
