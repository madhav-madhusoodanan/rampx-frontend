export const fetchTokensOfChain = async (chainId: number) => {
  const response = await fetch(`https://li.quest/v1/tokens?chains=${chainId}`)
  if (!response.ok) throw new Error('Failed to fetch tokens')
  const data = await response.json()
  // tokens.value[chainId] = data.tokens[chainId]
  return { result: data.tokens[chainId], chainId: chainId }
}
