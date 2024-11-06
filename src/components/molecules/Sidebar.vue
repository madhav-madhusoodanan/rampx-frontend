<script setup lang="ts">
import { ref } from 'vue'
import CrossIcon from "../icons/IconCross.vue";

const isOpen = defineModel<boolean>('isOpen')
</script>

<template>
  <!-- Sidebar using Teleport -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Backdrop -->
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-25 lg:hidden"
        @click="isOpen = false"
      />
    </Transition>

    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <!-- Sidebar -->
      <div
        v-if="isOpen"
        class="fixed inset-y-0 left-0 w-full max-w-xs bg-neutral-custom-900 text-primary-500 shadow-xl lg:hidden"
      >
        <!-- Sidebar header -->
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <h2 class="text-xl font-bold">Menu</h2>
          <button
            @click="isOpen = false"
            class="p-2 rounded-md text-primary-500 hover:text-black hover:bg-primary-500"
          >
            <CrossIcon />
          </button>
        </div>

        <!-- Sidebar content -->
        <!-- Add your sidebar content here -->
        <!--<div class="px-4 py-3">
          <nav class="space-y-3">
            <a href="#" class="block px-3 py-2 rounded-md hover:text-black hover:bg-primary-700">Home</a>
            <a href="#" class="block px-3 py-2 rounded-md hover:text-black hover:bg-primary-700">About</a>
            <a href="#" class="block px-3 py-2 rounded-md hover:text-black hover:bg-primary-700">Services</a>
            <a href="#" class="block px-3 py-2 rounded-md hover:text-black hover:bg-primary-700">Contact</a>
          </nav>
        </div> -->

        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>
