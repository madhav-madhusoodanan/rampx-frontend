<script setup lang="ts">
import TokenInput from '../components/molecules/TokenInput.vue';
import Button from '../components/atoms/Button.vue';
import SwitchIcon from '../components/icons/IconSwitch.vue';

</script>

<template>
  <div class="bg-neutral-custom-900 text-white">
    <div class="grid place-items-center h-[91vh]">
      <div class="w-[420px] border border-primary-500 p-8 flex flex-col items-center gap-4">
        <h1 class="text-xl w-full text-left font-semibold">EXCHANGE</h1>
        <div class="h-[2px] bg-primary-700 w-full my-1" />
        <TokenInput title="FROM" />
        <div class="flex flex-row justify-between w-full items-center mt-8 mb-2">
          <div class="h-px bg-primary-700 w-5/12" />
          <div class="h-8 w-8 bg-neutral-custom-900 border border-primary-500 grid place-items-center text-primary-500">
            <SwitchIcon />
          </div>
          <div class="h-px bg-primary-700 w-5/12" />
        </div>
        <TokenInput title="TO" />
        <Button>
          SWAP
        </Button>
      </div>
    </div>
  </div>
</template>
