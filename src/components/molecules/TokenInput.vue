<template>
  <div class="relative gap-2 w-full flex flex-col max-w-[500px]">
    <h2 class="text-white font-semibold"> {{ props.title }} </h2>
    <!-- Main input container with flexbox layout -->
    <div
      class="border border-primary-700 p-2 flex items-center gap-2 min-h-[40px] bg-primary-900 transition-shadow duration-200 shadow-custom hover:shadow-primary-500"
    >
      <!-- Token Dropdown -->
      <div class="relative min-w-[120px]">
        <button
          @click="toggleTokenDropdown"
          class="flex items-center gap-2 p-2 bg-primary-800"
        >
          <img
            v-if="selectedToken.icon"
            :src="selectedToken.icon"
            class="w-5 h-5 rounded-full"
            alt="token icon"
          />
          <span>{{ selectedToken.symbol }}</span>
          <i class="fas fa-chevron-down text-sm"></i>
        </button>
      </div>

      <!-- Token Dropdown Menu -->
      <Modal
        :isOpen="isTokenDropdownOpen"
        @close="isTokenDropdownOpen = false"
      >
        <div class="p-2 flex justify-center w-full text-center text-white"> Select Token </div>
        <div class="p-2">
          <input
            v-model="tokenSearch"
            type="text"
            placeholder="Search tokens..."
            class="w-full p-2 border rounded"
          />
        </div>
        <div class="max-h-60 overflow-y-auto">
          <button
            v-for="token in filteredTokens"
            :key="token.id"
            @click="selectToken(token)"
            class="w-full flex items-center gap-2 p-2 hover:bg-gray-100"
          >
            <img
              v-if="token.icon"
              :src="token.icon"
              class="w-5 h-5 rounded-full"
              alt="token icon"
            />
            <span>{{ token.symbol }}</span>
          </button>
        </div>
      </Modal>

      <!-- Amount Input -->
      <input
        v-model.number="amount"
        type="numeric"
        placeholder="Amount"
        class="flex-grow p-1 focus:outline-none bg-primary-900 text-right"
        @input="validateAmount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Modal from '../atoms/Modal.vue'

interface Token {
  id: number
  symbol: string
  icon: string | null
}

interface Chain {
  id: number
  name: string
  icon: string | null
}

interface TokenInputEmits {
  (e: 'update:token', value: Token): void
  (e: 'update:chain', value: Chain): void
  (e: 'update:amount', value: number): void
  (e: 'change', value: { token: Token; chain: Chain; amount: number }): void
}

interface TokenInputProps {
  tokens: Token[]
  chains: Chain[]
  modelValue?: {
    token?: Token
    chain?: Chain
    amount?: number
  }
  title: String
}

const props = withDefaults(defineProps<TokenInputProps>(), {
  modelValue: () => ({}),
  title: () => "",
  tokens: () => []
})

const emit = defineEmits<TokenInputEmits>()

// State
const isTokenDropdownOpen = ref(false)
const isChainDropdownOpen = ref(false)
const tokenSearch = ref('')
const amount = ref<number | null>(props.modelValue?.amount ?? null)
const selectedToken = ref<Token>(
  props.modelValue?.token ?? { id: 0, symbol: 'Select Token', icon: null }
)
const selectedChain = ref<Chain>(
  props.modelValue?.chain ?? { id: 0, name: 'Select Chain', icon: null }
)

// Computed
const filteredTokens = computed(() => {
  return props.tokens.filter(token =>
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
  emitChange()
}

const selectChain = (chain: Chain) => {
  selectedChain.value = chain
  isChainDropdownOpen.value = false
  emitChange()
}

const validateAmount = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  amount.value = Number(value)

  emitChange()
}

const emitChange = () => {
  emit('update:token', selectedToken.value)
  emit('update:chain', selectedChain.value)
  if (amount.value !== null) {
    emit('update:amount', amount.value)
  }
  emit('change', {
    token: selectedToken.value,
    chain: selectedChain.value,
    amount: amount.value ?? 0
  })
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

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  if (newValue?.token) {
    selectedToken.value = newValue.token
  }
  if (newValue?.chain) {
    selectedChain.value = newValue.chain
  }
  if (newValue?.amount !== undefined) {
    amount.value = newValue.amount
  }
}, { deep: true })
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
