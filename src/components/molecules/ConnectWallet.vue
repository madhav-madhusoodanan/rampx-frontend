<script setup lang="ts">
import { ref } from 'vue'
import { useAccount, useConnect, useDisconnect, useEnsName, type Connector } from '@wagmi/vue'
import TickIcon from '../icons/IconTick.vue';
import Modal from '../atoms/Modal.vue'

const isModalOpen = ref(false)
const connector = ref<Connector | undefined>(undefined)

const { address, isConnected, isConnecting } = useAccount()
const { connectors, connect } = useConnect()
const { disconnect } = useDisconnect()
const { data: ensName } = useEnsName({
  address,
})

interface AvailableWalletsType {
  [key: string]: string
}

const availableWallets: AvailableWalletsType  = {
  MetaMask:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/768px-MetaMask_Fox.svg.png',
  Safe: 'https://images.mirror-media.xyz/publication-images/NxbCAMO-GXXL7bZ7yu6lA.png',
}

const onSuccessFunction = () => setTimeout(() => isModalOpen.value = false, 1500)
const connectFunction = (_connector: Connector) => {
  connector.value = _connector;
  connect(
    { connector: _connector },
    { onSuccess: onSuccessFunction },
  )
}

</script>

<template>
  <!-- Navbar button when user is disconnected -->
  <button
    v-if="!isConnected"
    @click="isModalOpen = true"
    class="border-2 border-primary-500 px-4 py-2 text-lg text-primary-500 shadow shadow-primary-500 text-shadow-primary-500"
  >
    CONNECT WALLET
  </button>

  <!-- Navbar components when the user is connected -->
  <div v-else class="flex items-center gap-2">
    <span class="px-4 py-2 text-lg bg-neutral-custom-900 border border-primary-500 text-primary-500 text-shadow-primary-500 rounded">
      {{ ensName || address?.substring(0, 12) }}
    </span>
    <button
      @click="disconnect()"
      class="px-4 py-2 text-lg border border-primary-500 text-primary-500 rounded text-shadow-primary-500 hover:text-neutral-custom-900 hover:bg-primary-500 transition-all duration-150"
    >
      Disconnect
    </button>
  </div>

  <!-- Modal when the user is in the process of connecting wallet -->
  <Modal
    :isOpen="isModalOpen"
    @close="isModalOpen = false"
  >
    <!-- Appears when a wallet is requested for connection -->
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition duration-300 ease-out"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        class="absolute z-20 w-full h-full bg-primary-1000 left-0 top-0 rounded-lg grid place-items-center  bg-opacity-75 backdrop-blur-sm"
        v-if="isConnecting"
      >
        <div class="flex flex-col gap-2 items-center text-center">
          <span class="text-primary-500 w-2/3 text-3xl font-semibold">Approve the connection in {{ connector?.name }}</span>
          <!--
            <div class="my-4"></div>
            <span class="text-white w-5/6 text-lg">Having problems? click below</span>
            <button @click="connectFunction(connector)" class="font-semibold text-primary-500 border border-primary-700 bg-primary-800 text-lg text-center px-2 py-1">RELAUNCH CONNECTION</button>
          -->
        </div>
      </div>
    </Transition>

    <!-- Appears when the connection is successful -->
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition duration-300 ease-out"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isConnected"
        class="absolute z-20 w-full h-full bg-primary-500 left-0 top-0 rounded grid place-items-center text-black font-semibold text-2xl"
      >
          <div class="flex flex-col gap-2 items-center text-black">
            <TickIcon class="scale-75" />
            <span>WALLET</span>
            <span>CONNECTED</span>
          </div>
      </div>
    </Transition>

    <!-- Appears as wallet options for the user -->
    <div class="space-y-2">
      <div class="grid place-items-center">
        <img src="https://rampx.ag/assets/icons/rampx-favicon.svg" height="82.21" width="100" class="mb-6 mt-2" />
        <div class="text-lg font-semibold text-primary-500"> CONNECT WALLET </div>
      </div>
      <button
        v-for="connector in connectors"
        :key="connector.id"
        @click="connectFunction(connector)"
        class="w-full p-4 text-left border border-primary-700 rounded flex items-center gap-3 bg-primary-900"
      >

        <!-- List of wallet connection methods -->
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
