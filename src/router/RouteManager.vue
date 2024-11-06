<script setup lang="ts">
import { ref } from "vue";
import RouterLink from '../components/atoms/RouterLink.vue';
import Sidebar from '../components/molecules/Sidebar.vue';
import ConnectWallet from '../components/molecules/ConnectWallet.vue'
import BurgerIcon from '../components/icons/IconBurger.vue'

const isOpen = ref<boolean>(false)
</script>

<template>
  <header class="">
    <div class="bg-neutral-custom-900 h-full flex flex-row justify-between px-10 md:px-20">
      <img src="/logo-full.svg" height="25" width="132" />
      <nav
        class="hidden lg:flex h-full gap-14 justify-end items-center text-lg py-2"
      >
        <RouterLink to="/trade">TRADE</RouterLink>
        <!-- <RouterLink to="/perps">PERPS</RouterLink> -->
        <!-- <RouterLink to="/vaults">VAULTS</RouterLink> -->
        <RouterLink to="/markets">MARKETS</RouterLink>
        <ConnectWallet />
      </nav>
      <button
        class="text-primary-500 lg:hidden my-4"
        @click="isOpen = true"
      >
        <BurgerIcon />
      </button>
      <Sidebar v-model:isOpen="isOpen">
        <nav
          class="flex flex-col gap-4 p-4"
        >
          <RouterLink to="/trade">TRADE</RouterLink>
          <!-- <RouterLink to="/perps">PERPS</RouterLink> -->
          <!-- <RouterLink to="/vaults">VAULTS</RouterLink> -->
          <ConnectWallet />
        </nav>
      </Sidebar>
    </div>
  </header>
</template>
