<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['close']);
const handleBackdropClick = () => {
  emit('close');
}
const stopPropagation = e => {
  e.stopPropagation();
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-in-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-custom-900 bg-opacity-50"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition duration-300 ease-in-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in-out"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-md p-6 bg-neutral-custom-900 rounded-lg shadow-xl border border-primary-500"
            @click="stopPropagation"
          >
            <div class="flex flex-row-reverse justify-between mb-4 absolute top-4 right-4">
              <button
                @click="handleBackdropClick"
                class="text-primary-500 hover:text-primary-500"
              >
                <div class="px-2 py-1 border border-primary-500 bg-primary-900">✕</div>
              </button>
            </div>
            <slot name="error"></slot>
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
