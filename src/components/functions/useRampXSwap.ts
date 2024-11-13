import { type Ref, ref, computed, toValue, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useAccount, useReadContract, useWriteContract } from '@wagmi/vue'
import { type Chain, type Hex } from 'viem'
import { Aggregators } from "../../config/Aggregators"
interface Token {
  chainId: number
  address: Hex
  symbol: string
  name: string
  decimals: number
  priceUSD: string
  coinKey: string
  logoURI: string | null
}

// You'll need to define your contract ABI
const ROUTER_ABI = [
  // Add your router contract ABI here
  {}
]

export function useRampXSwap(
  sellChain: Ref<Chain>,
  sellToken: Ref<Token>,
  sellAmount: Ref<number | undefined>,
  buyChain: Ref<Chain>,
  buyToken: Ref<Token>,
) {
  const { address, isConnected } = useAccount()

  // State management
  const buyAmount = ref<number | undefined>(undefined)
  const updateTime = ref<number>(Date.now())
  const isLoading = ref<boolean>(false)

  // Quote fetching logic
  const fetchData = async(
    sellChain: Chain,
    buyChain: Chain,
    sellToken: Token,
    buyToken: Token,
    _sellAmount?: number,
  ) => {
    isLoading.value = true

    if(sellToken.symbol === buyToken.symbol && sellToken.chainId === buyToken.chainId) {
      isLoading.value = false
      updateTime.value = Date.now()
      buyAmount.value = _sellAmount
      return {}
    }

    if(_sellAmount === 0 || _sellAmount === undefined) {
      isLoading.value = false
      updateTime.value = Date.now()
      buyAmount.value = 0
      return {}
    }

    if(Date.now() - updateTime.value < 1000) {
      updateTime.value = Date.now()
      return {}
    }

    const sellAmountCalculated = _sellAmount * (10 ** sellToken.decimals)
    const contractAddress = Aggregators[sellChain.id]
    console.log("sell chain", sellChain.id)
    console.log("buy chain", buyChain.id)
    const response = await fetch(
      `https://li.quest/v1/quote?fromChain=${sellChain.id}&toChain=${buyChain.id}&fromToken=${sellToken.symbol}&toToken=${buyToken.symbol}&fromAddress=${contractAddress}&toAddress=${address}&fromAmount=${sellAmountCalculated}`
    )
    const responseJSON = await response.json()

    isLoading.value = false
    updateTime.value = Date.now()
    buyAmount.value = Number(
      Number(Number(responseJSON?.["estimate"]?.["toAmountMin"] ?? 0) / (10 ** buyToken.decimals)).toFixed(6)
    )

    return responseJSON
  }

  // Setup the query
  const { data } = useQuery({
    queryKey: ['search', address, sellToken, buyToken, sellAmount],
    queryFn: () => fetchData(
      sellChain.value,
      buyChain.value,
      sellToken.value,
      buyToken.value,
      sellAmount.value,
    ),
    enabled: computed(() => address.value != undefined),
    refetchInterval: 3100
  })

  return {
    // State
    sellChain,
    sellToken,
    sellAmount,
    buyChain,
    buyToken,
    buyAmount,
    isLoading,
    data,

    // Query
    // query,

    // Actions
    // onSwapClick,

    // Methods
    fetchData
  }
}
