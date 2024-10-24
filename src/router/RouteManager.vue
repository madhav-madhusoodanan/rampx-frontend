<script setup lang="ts">
import RouterLink from '../components/atoms/RouterLink.vue'
import ConnectWallet from '../components/molecules/ConnectWallet.vue'
</script>

<template>
  <header class="">
    <div class="bg-neutral-custom-900 h-full flex flex-row justify-between px-20">
      <img src="/logo-full.svg" height="25" width="132" />
      <nav
        class="h-full gap-14 flex justify-end items-center text-lg py-2"
      >
        <RouterLink to="/trade">TRADE</RouterLink>
        <RouterLink to="/perps">PERPS</RouterLink>
        <RouterLink to="/vaults">VAULTS</RouterLink>
        <ConnectWallet />
      </nav>
    </div>
  </header>
</template>
