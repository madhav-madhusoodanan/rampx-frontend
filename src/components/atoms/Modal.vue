<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  // title: {
  //   type: String,
  //   default: '',
  // },
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
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-custom-900 bg-opacity-50"
      @click="handleBackdropClick"
    >
      <div
        class="w-full max-w-md p-6 bg-neutral-custom-900 rounded-lg shadow-xl"
        @click="stopPropagation"
      >
        <div class="flex flex-row-reverse justify-between mb-4">
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
    </div>
  </Teleport>
</template>
