<template>
  <div class="p-6 w-screen min-h-screen grid place-items-center grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-4">
    <div class="w-full max-w-xl h-max bg-black p-6 rounded-lg">
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-primary-500">
          ${{ /* formatValue(chartData?.datasets?.[0]?.data?.[chartData.datasets[0]?.data.length - 1] ?? */ 0 }}M
        </h2>
        <p class="text-sm text-primary-500">Daily active users</p>
      </div>
      <div class="h-64 relative">
        <Line
          :data="chartData"
          :options="chartOptions"
          @mouseenter="onChartEnter"
          @mouseleave="onChartLeave"
        />
      </div>
    </div>

    <div class="w-full max-w-xl h-max bg-black p-6 rounded-lg">
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-primary-500">
          ${{ /* formatValue(chartData?.datasets?.[0]?.data?.[chartData.datasets[0]?.data.length - 1] ?? */ 0 }}M
        </h2>
        <p class="text-sm text-primary-500">Volume in RampX</p>
      </div>
      <div class="h-64 relative">
        <Line
          :data="chartData"
          :options="chartOptions"
          @mouseenter="onChartEnter"
          @mouseleave="onChartLeave"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Generate fake data
const generateData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseValue = 25000000;
  const values = [];

  for (let i = 0; i < months.length; i++) {
    const value = baseValue + Math.random() * 10000000 - 5000000;
    values.push(value);
  }

  return {
    labels: months.map(month => `${month} 2024`),
    values
  };
};

const formatValue = (value: number): string => {
  return (value / 1000000).toFixed(2);
};

const { labels, values } = generateData();

const chartData = ref<ChartData<'line'>>({
  labels,
  datasets: [
    {
      label: 'TVL',
      data: values,
      fill: true,
      borderColor: 'rgb(236, 252, 203)',
      backgroundColor: 'rgba(236, 252, 203, 0.1)',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: 'rgb(236, 252, 203)',
      pointHoverBorderColor: 'rgb(236, 252, 203)',
    },
  ],
});

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
          return `$${formatValue(context.raw)}M`;
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
        color: 'rgb(156, 163, 175)',
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        color: 'rgba(75, 85, 99, 0.2)',
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
        callback: (value: any) => `$${(value / 1000000).toFixed(0)}M`,
      },
      border: {
        display: false,
      },
    },
  },
});

// Optional: Add hover effects
const onChartEnter = () => {
  chartData.value.datasets[0].pointHoverRadius = 6;
};

const onChartLeave = () => {
  chartData.value.datasets[0].pointHoverRadius = 4;
};
</script>
