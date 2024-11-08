import { type Hex } from "viem";

export interface TokenDetail {
  token: Hex
  amount: number
}

export interface Route {
  processorIndex: number
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

    await fetch('http://localhost:8080/swap/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAddress,
        sellTokens,
        buyTokens,
        routes,
        userSignature,
        chainId
      })
    });

}