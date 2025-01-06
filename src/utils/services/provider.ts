import { RpcProvider } from 'starknet'
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../../.env' })

const nodeUrl = process.env.NODE_URL

if (!nodeUrl) {
  console.error('NODE_URL is not provided')
  process.exit(1)
}

export const provider = new RpcProvider({ nodeUrl })