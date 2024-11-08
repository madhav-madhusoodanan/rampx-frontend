import { http, createConfig } from '@wagmi/vue'
import { mainnet, sepolia, optimism, base } from '@wagmi/vue/chains'
import { injected, metaMask, safe, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [optimism, base],
  transports: {
    [optimism.id]: http(),
    [base.id]: http(),
  },
  connectors: [
    injected(),
    // walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
})
