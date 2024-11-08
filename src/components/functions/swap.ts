import { type Hex, encodeAbiParameters } from "viem";
import AggregatorABI from "../abi/Aggregator";
import { callExecutor, type TokenDetail, type Route } from "./callExecutor";

interface ChainDeployments {
  [chainId: number]: string
}

const chainDeployments: ChainDeployments = {
  10: "",
  8453: "",
  31337: ""
}

const AggregatorTypes = {
  TokenDetail: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  Route: [
    { name: 'processorIndex', type: 'uint256' },
    { name: 'sellTokenDetails', type: 'TokenDetail[]' },
    { name: 'payload', type: 'bytes' },
    { name: 'metadata', type: 'bytes' },
  ],
  Execution: [
    { name: 'user', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'sellTokens', type: 'TokenDetail[]' },
    { name: 'buyTokens', type: 'TokenDetail[]' },
    { name: 'routes', type: 'Route[]' },
  ]
} as const

export const generateSwapTx = async(response: any, readContract: Function, writeContract: Function, signTypedData: Function, userAddress: Hex) => {
  /*
    wrap the tx object:
    1. sellToken -> tokenDetails
    2. buyToken -> tokenDetails
    3. data, value, gas fees etc -> route
    4. if value == 0 -> user signs and we execute
    5. else -> user executes
  */

  const sellTokenDetails: TokenDetail[] = [{ token: response["action"]["fromToken"]["address"], amount: response["estimate"]["fromAmount"] }]
  const buyTokenDetails: TokenDetail[] = []

  if(response["action"]["toToken"]["address"] !== "0x0000000000000000000000000000000000000000"){
    // buyTokenDetails.push({ token: response["action"]["toToken"]["address"], amount: response["estimate"]["toAmountMin"] })
  }

  const routes: Route[] = [{
    processorIndex: 1,
    sellTokenDetails,
    payload: response["transactionRequest"]["data"],
    metadata: encodeAbiParameters([{ name: 'y', type: 'uint256' }], [response["transactionRequest"]["value"]])
  }];

  const fromChainId = response["action"]["fromChainId"] as number
  if(sellTokenDetails[0].token === "0x0000000000000000000000000000000000000000"){
    // send proper transaction request to our contract

    await writeContract({
      abi: AggregatorABI,
      address: chainDeployments[fromChainId],
      functionName: 'transferFrom',
      args: [
        sellTokenDetails,
        buyTokenDetails,
        routes,
      ],
    })

  } else {

    // send EIP712 signature request to our backend
    const nonce = readContract({
      abi: AggregatorABI,
      address: chainDeployments[fromChainId],
      functionName: 'nonces',
      chainId: fromChainId,
      args: [ userAddress ]
    })

    const signature = await signTypedData({
      types: AggregatorTypes,
      primaryType: 'Execution',
      message: {
        sellTokens: sellTokenDetails,
        buyTokens: buyTokenDetails,
        routes,
        user: userAddress,
        nonce
      },
    })

    // TODO: call API with this signature
    await callExecutor(userAddress, sellTokenDetails, buyTokenDetails, routes, signature, fromChainId)

  }

  /* Send the tx object to pass to wagmi */
}
