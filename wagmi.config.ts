import { http, createConfig } from '@wagmi/vue'
import { mainnet, sepolia } from '@wagmi/vue/chains'
import { injected, metaMask, safe, walletConnect } from '@wagmi/vue/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    // walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
})
