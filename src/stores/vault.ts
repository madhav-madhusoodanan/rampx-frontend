// stores/useVaultStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface TokenInVault {
  chainId: number
  address: string
  tokenAddress: string,
  tokenName: string,
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

interface VaultUserPosition {
  chainId: number
  sharesOwned: number
  assetsDeposited: number
  // lastDepositTimestamp?: number
  // lastDepositAmount?: number
}

interface Vault {
  id: string
  name: string
  description?: string
  leader: {
    address: string
    name?: string
    avatarUrl?: string
  }
  tokens: TokenInVault[]
  withdrawalPeriod: number
  tags: Tag[]
  aumHistory: AUMSnapshot[]
  userPosition: VaultUserPosition
  createdAt: number
  updatedAt: number
}

export const useVaultStore = defineStore('vaults', () => {
  // State
  const vaults = ref<Vault[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getVaultById = computed(() => {
    return (id: string) => vaults.value.find((vault: Vault) => vault.id === id)
  })

  const getVaultsByLeader = computed(() => {
    return (leaderAddress: string) =>
      vaults.value.filter((vault: Vault) =>
        vault.leader.address.toLowerCase() === leaderAddress.toLowerCase()
      )
  })

  const getVaultsByTag = computed(() => {
    return (tagName: string) =>
      vaults.value.filter((vault: Vault) =>
        vault.tags.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())
      )
  })

  const getUserVaults = computed(() => {
    return vaults.value.filter((vault: Vault) => vault.userPosition?.sharesOwned !== undefined)
  })

  const getVaultTokenProportion = computed(() => {
    return (vaultId: string) => {
      /// return { tokenName, tokenAmount }
      const vault = vaults.value.find((vault: Vault) => vault.id === vaultId)


    }
  })

  // Actions
  const fetchVaults = async () => {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetch('/api/vaults')
      if (!response.ok) throw new Error('Failed to fetch vaults')

      const data = await response.json()
      vaults.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching vaults:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateUserPosition = async (vaultId: string, position: VaultUserPosition) => {
    const vaultIndex = vaults.value.findIndex((vault: Vault) => vault.id === vaultId)
    if (vaultIndex >= 0) {
      vaults.value[vaultIndex].userPosition = position
    }
  }

  const addVault = (vault: Vault) => {
    const existingIndex = vaults.value.findIndex((vault: Vault) => vault.id === vault.id)
    if (existingIndex >= 0) {
      vaults.value[existingIndex] = vault
    } else {
      vaults.value.push(vault)
    }
  }

  return {
    // State
    vaults,
    isLoading,
    error,

    // Getters
    getVaultById,
    getVaultsByLeader,
    getVaultsByTag,
    getUserVaults,

    // Actions
    fetchVaults,
    updateUserPosition,
    addVault
  }
})
