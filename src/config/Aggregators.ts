import { mainnet, sepolia, optimism, base } from '@wagmi/vue/chains'
import { type Hex } from "viem"

interface AggregatorInterface {
  [key: number]: Hex
}

export const Aggregators: AggregatorInterface = {
  [optimism.id]: "0xfA07E4342F482Eed28DCdCB201db5DeC690894A0",
  [base.id]: "0x6f1bd0c04b02cB27EFdE27F28cbc464150a6d2eD"
}
