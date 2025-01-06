import { RpcProvider } from "starknet";

export const getProvider = () => {
    const rpctestnetUrl=String(process.env.NEXT_PUBLIC_RPC_TESTNET);
    const rpcUrl=String(process.env.NEXT_PUBLIC_RPC_MAINNET);
    if (process.env.NEXT_PUBLIC_NODE_ENV == 'testnet') {
      const provider = new RpcProvider({ nodeUrl: rpctestnetUrl});
      return provider;
    }
    else {
      const provider = new RpcProvider({ nodeUrl: rpcUrl});
      return provider;
  
    }
  }