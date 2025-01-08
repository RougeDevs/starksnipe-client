import { RpcProvider } from 'starknet'

export const provider = (nodeUrl: string) => {
  if (!nodeUrl) {
    console.error('NODE_URL is not provided')
    process.exit(1)
  }
  return new RpcProvider({ nodeUrl })
}