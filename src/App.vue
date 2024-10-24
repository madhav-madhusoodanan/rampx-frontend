<script setup lang="ts">
import { RouterView } from 'vue-router'
import RouteManager from "./router/RouteManager.vue"
</script>

<template>
  <div class="flex flex-col">
    <RouteManager />
    <RouterView />
  </div>
</template>
