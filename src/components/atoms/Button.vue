<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  onclick: (payload: MouseEvent) => void
}>();
</script>

<template>
  <button class="px-6 py-2 transition-colors duration-200 hover:bg-primary-500 hover:text-black border-primary-500 border text-primary-500 text-lg" @click="props.onclick">
    <slot></slot>
  </button>
</template>
