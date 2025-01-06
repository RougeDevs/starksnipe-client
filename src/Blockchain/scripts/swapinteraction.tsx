import { Contract, uint256 } from "starknet";
import erc20Abi from '../abis/erc20abi.json'
import { getProvider } from "../strk-constants";
import { parseAmount } from "../utils/utils";
export async function getBalance(address:string,tokenAddress:string){ 
    const provider = getProvider();
    try {
      const erc20Contract = new Contract(erc20Abi, tokenAddress, provider);
      const res:any = await erc20Contract.call("balanceOf", [address], {
        blockIdentifier: "pending",
      });
      const res2:any=await erc20Contract.call("decimals", [], {blockIdentifier: "pending"})
      const amnt=parseAmount(uint256.uint256ToBN(res?.balance).toString(),Number(res2.decimals));
      return amnt;
      ////console.log("supported pools for Myswap is: ", res);
    } catch (error) {
        // return error;
     //console.log("error in getSupportedPoolsMyswap: ", error);
    }
  }