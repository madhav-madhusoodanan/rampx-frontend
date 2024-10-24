<script setup lang="ts">
import { ref } from 'vue'
import { useAccount, useConnect, useDisconnect, useEnsName } from '@wagmi/vue'
import Modal from '../atoms/Modal.vue'

const isModalOpen = ref(false)

const { address, isConnected, connector } = useAccount()
const { connectors, connect, isSuccess } = useConnect()
const { disconnect } = useDisconnect()
const { data: ensName } = useEnsName({
  address,
})

const availableWallets = {
  MetaMask:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png',
  Safe: 'https://images.mirror-media.xyz/publication-images/NxbCAMO-GXXL7bZ7yu6lA.png',
}
</script>

<template>
  <button
    v-if="!isConnected"
    @click="isModalOpen = true"
    class="border-2 border-primary-500 px-6 py-2 text-lg text-primary-500 shadow shadow-primary-500 text-shadow-primary-500"
  >
    CONNECT WALLET
  </button>

  <div v-else class="flex items-center gap-2">
    <span class="px-4 py-2 text-lg bg-neutral-custom-900 border border-primary-500 text-primary-500 text-shadow-primary-500 rounded">
      {{ ensName || address.substring(0, 12) }}
    </span>
    <button
      @click="disconnect()"
      class="px-4 py-2 text-lg border border-primary-500 text-primary-500 rounded text-shadow-primary-500 hover:text-neutral-custom-900 hover:bg-primary-500 transition-all duration-150"
    >
      Disconnect
    </button>
  </div>

  <Modal
    :isOpen="isModalOpen"
    @close="isModalOpen = false"
  >
    <template #error>
      <div
        v-if="error"
        class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded"
      >
        {{ error.message }}
      </div>
    </template>

    <div class="space-y-2">
      <div class="grid place-items-center">
        <img src="https://rampx.ag/assets/icons/rampx-favicon.svg" height="82.21" width="100" class="mb-6 mt-2" />
        <div class="text-lg font-semibold text-primary-500"> CONNECT WALLET </div>
      </div>
      <button
        v-for="connector in connectors"
        :key="connector.id"
        @click="
          connect(
            { connector },
            {
              onSuccess: () => {
                isModalOpen = false
              },
            },
          )
        "
        class="w-full p-4 text-left border border-primary-700 rounded flex items-center gap-3 bg-primary-900"
      >
        <span class="text-lg text-primary-500">
          <img
            v-if="connector.icon || availableWallets[connector.name]"
            height="30"
            width="30"
            :src="connector.icon || availableWallets[connector.name]"
          />
          <span v-else hidden> </span>
        </span>
        <span class="text-primary-500">{{ connector.name }}</span>
      </button>
    </div>
  </Modal>
</template>

<style>
  .text-shadow-primary-500 {
    text-shadow: #D0F603 0px 0px 10px;
  }
</style>
