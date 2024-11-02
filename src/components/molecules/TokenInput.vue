<template>
  <div class="relative gap-2 w-full flex flex-col max-w-[500px]">
    <h2 class="text-white font-semibold"> {{ props.title }} </h2>
    <!-- Main input container with flexbox layout -->
    <div
      class="border border-primary-700 p-2 flex items-center gap-2 min-h-[40px] bg-primary-900 transition-shadow duration-200 shadow-custom hover:shadow-primary-500"
    >
      <!-- Token Dropdown -->
      <div class="relative min-w-[80px]">
        <button
          @click="toggleTokenDropdown"
          class="flex items-center gap-2 p-2 px-3 bg-primary-800"
        >
          <img
            v-if="selectedToken?.logoURI"
            :src="selectedToken?.logoURI"
            class="w-5 h-5 rounded-full"
            alt=""
          />
          <span v-else class="h-5 w-5" />
          <span>{{ selectedToken?.symbol }}</span>
        </button>
      </div>

      <!-- Token Dropdown Menu -->
      <Modal
        :isOpen="isTokenDropdownOpen"
        @close="isTokenDropdownOpen = false"
      >
        <div class="flex flex-col gap-4">
          <div>
            <div class="py-2 flex justify-start w-full text-left text-white"> Select Chain </div>
            <div class="gap-2 grid grid-cols-2 grid-row-2">
              <button
                v-for="chain in tokenAndChainStore.chains"
                :key="chain.id"
                @click="selectChain(chain)"
                class="w-full flex items-center gap-2 rounded bg-primary-900 hover:bg-primary-700 transition-colors animate-300 border border-primary-700 text-primary-500"
                :class="{ '!bg-primary-500 !text-black': selectedChain?.id === chain.id }"
              >
                <!-- <img
                  v-if="chain.icon"
                  :src="chain.icon"
                  class="w-5 h-5 rounded-full"
                  alt=""
                /> -->
                <span class="p-2"> {{ chain?.name }}</span>
              </button>
            </div>
          </div>
          <div>
            <div class="py-2 flex justify-start w-full text-left text-white"> Select Token </div>
            <input
              v-model="tokenSearch"
              type="text"
              placeholder="Search tokens..."
              class="w-full p-2 mb-2 border rounded"
            />
            <div class="max-h-60 overflow-y-auto flex flex-col gap-1">
              <button
                v-for="token in filteredTokens"
                :key="token?.name"
                @click="selectToken(token)"
                class="w-full flex items-center gap-2 p-2 bg-primary-900 border border-primary-700 text-primary-500 rounded"
              >
                <img
                  v-if="token?.logoURI"
                  :src="token?.logoURI"
                  class="w-5 h-5 rounded-full"
                  alt=""
                />
                <span>{{ token?.symbol }}</span>
              </button>
            </div>
          </div>
        </div>
        </Modal>

        <!-- Amount Input -->
        <input
          v-model.number="selectedAmount"
          type="numeric"
          placeholder="Amount"
          class="p-1 focus:outline-none bg-primary-900 text-right max-w-[180px] sm:max-w-80 flex-grow-0 sm:flex-grow "
          @input="validateAmount"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { type Chain } from "viem"
import Modal from '../atoms/Modal.vue'

import { useTokenStore } from "../../stores/chainTokens"


interface Token {
  name: string
  symbol: string
  logoURI: string | null
}

interface InputProps {
  title: String
}

const props = withDefaults(defineProps<InputProps>(), {
  title: () => "",
})

// Stores
const tokenAndChainStore = useTokenStore()

// State
const isTokenDropdownOpen = ref(false)
const isChainDropdownOpen = ref(false)
const tokenSearch = ref('')

// Two-way boound variables
const selectedToken = defineModel<Token>('token')
const selectedChain = defineModel<Chain>('chain')
const selectedAmount = defineModel<number>('amount')

// Computed
const filteredTokens = computed(() => {
  return (tokenAndChainStore.tokens[selectedChain.value?.id ?? 0] ?? []).filter((token: Token) =>
    token.symbol.toLowerCase().includes(tokenSearch.value.toLowerCase())
  )
})

// Methods
const toggleTokenDropdown = () => {
  console.log("token dropdown!")
  isTokenDropdownOpen.value = !isTokenDropdownOpen.value
}

const toggleChainDropdown = () => {
  console.log("chain dropdown!")
  isChainDropdownOpen.value = !isChainDropdownOpen.value
}

const selectToken = (token: Token) => {
  selectedToken.value = token
  isTokenDropdownOpen.value = false
}

const selectChain = (chain: Chain) => {
  selectedChain.value = chain
  isChainDropdownOpen.value = false
}

const validateAmount = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  selectedAmount.value = Number(value)
}

// Lifecycle
onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
  }

  document.addEventListener('click', handleClickOutside)

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

</script>

<style scoped>
/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
