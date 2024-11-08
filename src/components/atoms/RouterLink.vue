<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <RouterLink class="text-white font-semibold" activeClass="text-primary-500 underlined" :to="to">
    <slot></slot>
  </RouterLink>
</template>
