<script setup lang="ts">
import { RouterView } from 'vue-router'
import RouteManager from "./router/RouteManager.vue"
</script>

<template>
  <main class="relative flex flex-col h-screen ">
    <RouteManager />
    <RouterView />
  </main>
</template>

<style scoped>
 main{
   /* background-color: black; */
   /* z-index: -10; */
   opacity: 0.999;
  }

  main::before {
    background-image: url("/codebgstatic.png");
    content: "";
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -10;
    background-repeat: no-repeat;
    background-position: 50% 0;
    background-size: cover;
 }

 main::after {
    content: "";
    background-color: #100f0f;
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -5;
    opacity: 0.9;
 }
</style>
