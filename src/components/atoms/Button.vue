<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps({
  onclick: {
    type: Function,
    required: true,
  }
});
</script>

<template>
  <button class="px-6 py-2 border-primary-500 border text-primary-500 text-lg" @click="onclick">
    <slot></slot>
  </button>
</template>
