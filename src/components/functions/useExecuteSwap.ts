import { useAccount, useSignTypedData, useWriteContract, useReadContract } from "@wagmi/vue";
import { type Hex, encodeAbiParameters } from "viem";
import AggregatorABI from "../abi/Aggregator";
import { callExecutor, type TokenDetail, type Route } from "./callExecutor";
import { Aggregators } from "../../config/Aggregators"


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

export const useExecuteSwap = () => {
  /*
    wrap the tx object:
    1. sellToken -> tokenDetails
    2. buyToken -> tokenDetails
    3. data, value, gas fees etc -> route
    4. if value == 0 -> user signs and we execute
    5. else -> user executes
  */

  const { address: userAddress } = useAccount()
  const { signTypedDataAsync } = useSignTypedData()
  const { writeContract } = useWriteContract()

  const onClick = (response: any) => async() => {

    if(response?.["action"]?.["fromChainId"] === undefined){
      console.warn("Empty response!")
    }

    const sellTokenDetails: TokenDetail[] = [{ token: response["action"]["fromToken"]["address"], amount: (BigInt(response["estimate"]["fromAmount"])) }]
    const buyTokenDetails: TokenDetail[] = []

    if(response["action"]["toToken"]["address"] !== "0x0000000000000000000000000000000000000000"){
      // buyTokenDetails.push({ token: response["action"]["toToken"]["address"], amount: response["estimate"]["toAmountMin"] })
    }

    const routes: Route[] = [{
      processorIndex: 1n,
      sellTokenDetails,
      payload: response["transactionRequest"]["data"],
      metadata: encodeAbiParameters([{ name: 'y', type: 'uint256' }], [response["transactionRequest"]["value"]])
    }];

      console.log("signing at the moment")

    const fromChainId = response["action"]["fromChainId"] as number
    if(sellTokenDetails[0].token === "0x0000000000000000000000000000000000000000"){
      // send proper transaction request to our contract
      console.log("signing now")

      await writeContract({
        abi: AggregatorABI,
        chainId: fromChainId,
        address: Aggregators[fromChainId],
        functionName: 'execute',
        args: [
          sellTokenDetails,
          buyTokenDetails,
          routes,
        ],
        value: sellTokenDetails[0].amount
      })

    } else {

      // send EIP712 signature request to our backend
      const nonce = useReadContract({
        abi: AggregatorABI,
        address: Aggregators[fromChainId],
        functionName: 'nonces',
        chainId: fromChainId,
        args: [ userAddress.value as Hex ]
      })

      const signature = await signTypedDataAsync({
        types: AggregatorTypes,
        primaryType: 'Execution',
        message: {
          sellTokens: sellTokenDetails,
          buyTokens: buyTokenDetails,
          routes,
          user: userAddress.value as Hex,
          nonce: nonce.data as unknown as bigint
        },
      })

      // TODO: call API with this signature
      await callExecutor(userAddress.value as Hex, sellTokenDetails, buyTokenDetails, routes, signature, fromChainId)

    }
  }

  return onClick

  /* Send the tx object to pass to wagmi */
}
