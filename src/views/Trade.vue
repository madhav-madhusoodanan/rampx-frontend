<script setup lang="ts">
import {ref} from "vue";
import {type Chain} from "viem";
import TokenInput from '../components/molecules/TokenInput.vue';
import Button from '../components/atoms/Button.vue';
import SwitchIcon from '../components/icons/IconSwitch.vue';

import { useTokenStore } from "../stores/chainTokens";

const tokenChainStore = useTokenStore();

const sellChain = ref<Chain>(tokenChainStore.chains[0])
const sellToken = ref(tokenChainStore.tokens[sellChain.value.id][0])
const sellAmount = ref(undefined)

const buyChain = ref<Chain>(tokenChainStore.chains[0])
const buyToken = ref(tokenChainStore.tokens[sellChain.value.id][0])
const buyAmount = ref(undefined)

const switchBuySell = () => {
  const tempToken = buyToken.value
  buyToken.value = sellToken.value
  sellToken.value = tempToken

  const tempChain = buyChain.value
  buyChain.value = sellChain.value
  sellChain.value = tempChain

  const tempAmount = buyAmount.value
  buyAmount.value = sellAmount.value
  sellAmount.value = tempAmount
}

</script>

<template>
  <div class="text-white">
    <div class="grid place-items-center h-[91vh]">
      <div class="w-[420px] border border-primary-500 p-8 flex flex-col items-center gap-4">
        <h1 class="text-xl w-full text-left font-semibold">EXCHANGE</h1>
        <div class="h-[2px] bg-primary-700 w-full my-1" />
        <TokenInput
          v-model:token="sellToken"
          v-model:chain="sellChain"
          v-model:amount="sellAmount"
          title="FROM"
        />
        <div class="flex flex-row justify-between w-full items-center mt-8 mb-2">
          <div class="h-px bg-primary-700 w-5/12" />
          <button
            @click="switchBuySell"
            class="h-8 w-8 bg-neutral-custom-900 border border-primary-500 grid place-items-center text-primary-500"
          >
            <SwitchIcon />
        </button>
          <div class="h-px bg-primary-700 w-5/12" />
        </div>
        <TokenInput
          v-model:token="buyToken"
          v-model:chain="buyChain"
          v-model:amount="buyAmount"
          title="TO"
        />
        <Button :onclick="console.log">
          SWAP
        </Button>
      </div>
    </div>
  </div>
</template>
