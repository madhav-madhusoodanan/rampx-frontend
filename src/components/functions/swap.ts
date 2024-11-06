import { encodeAbiParameters } from "viem"

const chainDeployments = {
  10: "",
  8453: ""
}

export const generateSwapTx = async(response: any) => {
  /*
    wrap the tx object:
    1. sellToken -> tokenDetails
    2. buyToken -> tokenDetails
    3. data, value, gas fees etc -> route
    4. if value == 0 -> user signs and we execute
    5. else -> user executes
  */

  const sellTokenDetails = [{ token: response["action"]["fromToken"]["address"], amount: response["estimate"]["fromAmount"] }]
  const buyTokenDetails = []

  if(response["action"]["toToken"]["address"] !== "0x0000000000000000000000000000000000000000"){
    buyTokenDetails.push({ token: response["action"]["toToken"]["address"], amount: response["estimate"]["toAmountMin"] })
  }

  const routes = [{
    processorIndex: 1,
    sellTokenDetails,
    payload: response["transactionRequest"]["data"],
    metadata: encodeAbiParameters([{ name: 'y', type: 'uint256' }], [response["transactionRequest"]["value"]])
  }];

  if(sellTokenDetails[0].token === "0x0000000000000000000000000000000000000000"){
    // send proper transaction request to our contract
  } else {
    // send EIP712 signature request to our backend

  }



  /* Send the tx object to pass to wagmi */
}
