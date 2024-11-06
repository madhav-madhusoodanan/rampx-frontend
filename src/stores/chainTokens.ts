// stores/useTokenStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type Chain } from "viem"
import { abstractTestnet, sepolia, optimism, base } from "viem/chains"

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

interface TokensByChain {
  [chainId: number]: Token[]
}

export const useTokenStore = defineStore('tokens', () => {
  // State
  const tokens = ref<TokensByChain>(
    {
      10: [{
        "chainId": 10,
        "address": "0x0000000000000000000000000000000000000000",
        "symbol": "ETH",
        "name": "ETH",
        "decimals": 18,
        "priceUSD": "2591.6",
        "coinKey": "ETH",
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
      },
      {
        "chainId": 10,
        "address": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        "symbol": "USDC.e",
        "name": "Bridged USD Coin",
        "decimals": 6,
        "priceUSD": "1",
        "coinKey": "USDCe",
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
      }],
      8453: [{
        "chainId": 8453,
        "address": "0x0000000000000000000000000000000000000000",
        "symbol": "ETH",
        "name": "ETH",
        "decimals": 18,
        "priceUSD": "2597.42",
        "coinKey": "ETH",
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
      },{
        "chainId": 8453,
        "address": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "symbol": "USDC",
        "name": "USD Coin",
        "decimals": 6,
        "priceUSD": "0.9999000099990001",
        "coinKey": "USDC",
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
      }]
    }
  )

  const chains = ref<Chain[]>([optimism, base])

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


  // Actions
  const fetchTokens = async (chainId: number) => {
    try {
      isLoading.value = true
      error.value = null

      // Replace with your actual API endpoint
      const response = await fetch(`https://li.quest/v1/tokens?chains=${chainId}`)
      if (!response.ok) throw new Error('Failed to fetch tokens')

      const data = await response.json()
      tokens.value[chainId] = data["tokens"][`${chainId}`]
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

    // Actions
    fetchTokens,
    fetchChains,
    initialize
  }
})
