// stores/useTokenStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interfaces
interface NativeCurrency {
  name: string
  symbol: string
  decimals: number
}

interface MetamaskConfig {
  chainId: string
  blockExplorerUrls: string[]
  chainName: string
  nativeCurrency: NativeCurrency
  rpcUrls: string[]
}

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

interface Chain {
  key: string
  chainType: string
  name: string
  coin: string
  id: number
  mainnet: boolean
  logoURI: string
  tokenlistUrl: string
  faucetUrls?: string[]
  multicallAddress: string
  metamask: MetamaskConfig
  nativeToken: Token
  diamondAddress: string
  permit2: string
}

interface TokensByChain {
  [chainId: string]: Token[]
}

export const useTokenStore = defineStore('tokens', () => {
  // State
  const tokens = ref<TokensByChain>({})
  const chains = ref<Chain[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getTokensByChainId = computed(() => {
    return (chainId: number) => tokens.value[chainId] || []
  })

  /* Note: this function will be used by vault to find the token used by a vault */
  const getTokenByAddress = computed(() => {
    return (chainId: number, address: string) => {
      const chainTokens = tokens.value[chainId] || []
      return chainTokens.find((token: Token) =>
        token.address.toLowerCase() === address.toLowerCase()
      )
    }
  })

  const getChainById = computed(() => {
    return (chainId: number) =>
      chains.value.find((chain: Chain) => chain.id === chainId)
  })

  const getNativeToken = computed(() => {
    return (chainId: number) => {
      const chain = getChainById.value(chainId)
      return chain?.nativeToken
    }
  })

  // Actions
  const fetchTokens = async (chainId: number) => {
    try {
      isLoading.value = true
      error.value = null

      // Replace with your actual API endpoint
      const response = await fetch(`/api/tokens/${chainId}`)
      if (!response.ok) throw new Error('Failed to fetch tokens')

      const data = await response.json()
      tokens.value[chainId] = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching tokens:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchChains = async () => {
    try {
      isLoading.value = true
      error.value = null

      // Replace with your actual API endpoint
      const response = await fetch('/api/chains')
      if (!response.ok) throw new Error('Failed to fetch chains')

      const data = await response.json()
      chains.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching chains:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Initialize store
  const initialize = async () => {
    await fetchChains()
    // Optionally fetch tokens for specific chains here
  }

  return {
    // State
    tokens,
    chains,
    isLoading,
    error,

    // Getters
    getTokensByChainId,
    getTokenByAddress,
    getChainById,
    getNativeToken,

    // Actions
    fetchTokens,
    fetchChains,
    initialize
  }
})
