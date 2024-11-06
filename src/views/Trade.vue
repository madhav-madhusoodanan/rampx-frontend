<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { type Chain, type Hex } from 'viem'
import TokenInput from '../components/molecules/TokenInput.vue'
import Button from '../components/atoms/Button.vue'
import SwitchIcon from '../components/icons/IconSwitch.vue'
import { useAccount } from '@wagmi/vue'
import { useTokenStore } from '../stores/chainTokens'
import {useQuery} from "@tanstack/vue-query"

const tokenChainStore = useTokenStore()
const { address, isConnected, isConnecting } = useAccount()

const sellChain = ref<Chain>(tokenChainStore.chains[0])
const sellToken = ref(tokenChainStore.tokens[sellChain.value.id][0])
const sellAmount = ref<number>(0)

const buyChain = ref<Chain>(tokenChainStore.chains[0])
const buyToken = ref(tokenChainStore.tokens[sellChain.value.id][0])
const buyAmount = ref<number>(0)

interface Token {
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: number
  priceUSD: string
  coinKey: string
  logoURI: string
}

const fetchData = async(sellChain: Chain, buyChain: Chain, sellToken: Token, buyToken: Token, _sellAmount: number, userAddress?: Hex, ) => {
  // Replace this with your actual API endpoint

  if(sellToken.symbol === buyToken.symbol && sellToken.chainId === buyToken.chainId){
    buyAmount.value = _sellAmount
    return {}
  }

  if(_sellAmount === 0){
    buyAmount.value = 0
    return {}
  }

  console.log("[LOG] fetchData call")
  const sellAmountCalculated = _sellAmount * (10 ** sellToken.decimals)
  const response = await fetch(`https://li.quest/v1/quote?fromChain=${sellChain.id}&toChain=${buyChain.id}&fromToken=${sellToken.symbol}&toToken=${buyToken.symbol}&fromAddress=${userAddress}&fromAmount=${sellAmountCalculated}`)
  const responseJSON = await response.json()
  console.log("[LOG] received response", responseJSON)

  buyAmount.value = Number(Number(Number(responseJSON?.["estimate"]?.["toAmountMin"] ?? 0) / (10 ** buyToken.decimals)).toFixed(6))

  return responseJSON
}

// Setup the query
const query = useQuery({
  queryKey: [ 'search', address, sellToken, buyToken],
  queryFn: () => fetchData(sellChain.value, buyChain.value, sellToken.value, buyToken.value, sellAmount.value, address.value),
  enabled: computed(() => address.value != undefined),
  refetchInterval: 3100
})

// Watch for query results and update the second input
// watch(
//   [ address, sellAmount, sellChain, buyChain, sellToken, buyToken ],
//   async ([_userAddress, _sellChain, _buyChain, _sellToken, _buyToken, _sellAmount]) => {
//     console.log("[LOG] before newData check")
//     const data = await fetchData(_userAddress, _sellChain, _buyChain, _sellToken, _buyToken, _sellAmount)
//     buyAmount.value = Number(data?.["estimate"]?.["toAmountMin"] ?? 0) / (10 ** buyToken.value.decimals) // Adjust according to your API response structure
//   }
// )

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
        class="w-[360px] sm:w-[420px] border border-primary-500 p-8 flex flex-col items-center gap-4"
      >
        <h1 class="text-xl w-full text-left font-semibold">EXCHANGE</h1>
        <div class="h-[2px] bg-primary-700 w-full my-1" />
        <TokenInput
          v-model:token="sellToken"
          v-model:chain="sellChain"
          v-model:amount="sellAmount"
          title="FROM"
        />
        <div
          class="flex flex-row justify-between w-full items-center mt-8 mb-2"
        >
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
        <Button :onclick="console.log"> SWAP </Button>
      </div>
    </div>
  </div>
</template>
