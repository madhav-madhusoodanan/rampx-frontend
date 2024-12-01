<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { type Chain, type Hex } from 'viem'
import TokenInput from '../components/molecules/TokenInput.vue'
import Button from '../components/atoms/Button.vue'
import SwitchIcon from '../components/icons/IconSwitch.vue'
import { useAccount } from '@wagmi/vue'
import { useTokenStore } from '../stores/chainTokens'

import { useRampXSwap } from "../components/functions/useRampXSwap"
import { useExecuteSwap } from "../components/functions/useExecuteSwap"
import { useQuery } from '@tanstack/vue-query'

const tokenChainStore = useTokenStore()
// const { address, isConnected, isConnecting } = useAccount()

const sellChain = ref<Chain>(tokenChainStore.chains[0])
const sellToken = ref(tokenChainStore.tokens[sellChain.value.id][0])
const sellAmount = ref<number | undefined>(undefined)

const buyChain = ref<Chain>(tokenChainStore.chains[0])
const buyToken = ref(tokenChainStore.tokens[sellChain.value.id][0])
const { data, buyAmount, isLoading } = useRampXSwap(sellChain, sellToken, sellAmount, buyChain, buyToken)
const onClick = useExecuteSwap();

(async function(){
  const response = await fetch("https://test-backend-749089128200.us-central1.run.app/token/details/usd-coin")
  console.log("GECKO", await response.json())
})()

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
      <div
        id="swap_component"
        class="w-[360px] sm:w-[420px] p-8 flex flex-col items-center gap-4 after:bg-neutral-custom-700 bg-gradient-to-r from-primary-500 to-primary-500 via-transparent border-1 after:border-r-primary-500"
      >
        <h1 class="text-xl w-full text-left font-semibold">EXCHANGE</h1>
        <div class="h-[2px] bg-primary-700 w-full my-1" />
        <TokenInput
          v-model:token="sellToken"
          v-model:chain="sellChain"
          v-model:amount="sellAmount"
          :loading="false"
          title="FROM"
        />
        <div
          class="flex flex-row justify-between w-full items-center my-2"
        >
          <div class="h-px bg-primary-700 w-5/12" />
          <button
            @click="switchBuySell"
            class="h-8 w-8 bg-neutral-800 border border-primary-500 grid place-items-center text-primary-500 transition-all duration-200 shadow-custom hover:shadow-primary-500 hover:text-primary-900 hover:bg-primary-500"
          >
            <SwitchIcon />
          </button>
          <div class="h-px bg-primary-700 w-5/12" />
        </div>
        <TokenInput
          v-model:token="buyToken"
          v-model:chain="buyChain"
          v-model:amount="buyAmount"
          :loading="isLoading"
          title="TO"
        />
        <div class="h-px bg-primary-800 w-full" />
        <Button :onclick="onClick(data)" class=" shadow-custom shadow-primary-500"> SWAP </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #swap_component {
    clip-path: polygon(0 0,92.8% 0,100% 6.2%,100% 100%,8% 100%,0 93%,0 0);
    position: relative;
    z-index: 1;
  }
  #swap_component::after {
    clip-path: polygon(0 0,93% 0,100% 6%,100% 100%,8% 100%,0 93%,0 0);
    content: '';
    z-index: -1;
    height: calc(100% - 4.5px);
    width: calc(100% - 4.5px);
    top: 2px;
    left: 2px;
    /* background-color: white; */
    position: absolute;
  }
</style>
