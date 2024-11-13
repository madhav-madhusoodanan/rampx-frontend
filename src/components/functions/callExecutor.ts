import { type Hex } from "viem";
import { serialize } from "@wagmi/vue"

export interface TokenDetail {
  token: Hex
  amount: bigint
}

export interface Route {
  processorIndex: bigint
  sellTokenDetails: TokenDetail[]
  payload: Hex
  metadata: Hex
}

export async function callExecutor(
  userAddress: Hex,
  sellTokens: TokenDetail[],
  buyTokens: TokenDetail[],
  routes: Route[],
  userSignature: Hex,
  chainId: number
){

    await fetch('https://rampx-backend-749089128200.us-central1.run.app/swap/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: serialize({
        userAddress,
        sellTokens,
        buyTokens,
        routes,
        userSignature,
        chainId
      })
    });

}
