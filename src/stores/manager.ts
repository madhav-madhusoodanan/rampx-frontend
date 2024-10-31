// stores/useVaultStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface TokenShare {
  tokenAddress: string
  chainId: number
  amount: number
}

/// this value is summed over the tokens pressent on all chains
interface AUMSnapshot {
  timestamp: number
  valueUSD: number
}

interface Tag {
  id: number
  name: string
  category: 'ASSET_FOCUS' | 'RISK_PROFILE' | 'STRATEGY' | string
}

interface VaultInteractions {
  chainId: number
  vaultAddress: string
  sharesReceived: number
  assetsDeposited: number
  depositTimestamp?: number
  // lastDepositAmount?: number
}

/// must cover all vaults owned by the manager
interface Vault {
  address: string
  tokenAddress: string
  chainId: number
}

interface Manager {
  id: string
  name: string
  description?: string
  leader: {
    address: string
    name?: string
    avatarUrl?: string
  }
  tokens: TokenShare[]
  withdrawalPeriod: number
  tags: Tag[]
  vaults: Vault[]
  aumHistory: AUMSnapshot[]
  userInteractions: VaultInteractions[]
  createdAt: number
  updatedAt: number
}

export const useManagerStore = defineStore('vaults', () => {
  // State
  const managers = ref<Manager[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getVaultById = computed(() => {
    return (id: string) => managers.value.find((manager: Manager) => manager.id === id)
  })

  const getVaultsByLeader = computed(() => {
    return (leaderAddress: string) =>
      managers.value.filter((manager: Manager) =>
        manager.leader.address.toLowerCase() === leaderAddress.toLowerCase()
      )
  })

  const getVaultsByTag = computed(() => {
    return (tagName: string) =>
      managers.value.filter((manager: Manager) =>
        manager.tags.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())
      )
  })


  const getManagerTokenProportion = computed(() => {
    return (managerId: string) => {
      const manager = managers.value.find((manager: Manager) => manager.id === managerId)
      return manager?.tokens ?? []
    }
  })

  // Actions
  const fetchManagers = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetch('/api/vaults')
      if (!response.ok) throw new Error('Failed to fetch vaults')

      const data = await response.json()
      managers.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching vaults:', err)
    } finally {
      isLoading.value = false
    }
  }

   return {
    // State
    managers,
    isLoading,
    error,

    // Getters
    getVaultById,
    getVaultsByLeader,
    getVaultsByTag,
    getManagerTokenProportion,

    // Actions
    fetchManagers
  }
})
