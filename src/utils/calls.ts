import {Call, CallData, ProviderInterface, hash} from "starknet";
import { MULTICALL_AGGREGATOR_ADDRESS } from "./constants";
import {Selector} from "./constants";

export async function multiCallContract(
    provider: ProviderInterface,
    calls: Call[],
  ) {
    const calldata = calls.map((call) => {
      return CallData.compile({
        to: call.contractAddress,
        selector: hash.getSelector(call.entrypoint),
        calldata: call.calldata ?? [],
      })
    })
  
    const rawResult = await provider.callContract({
      contractAddress: MULTICALL_AGGREGATOR_ADDRESS,
      entrypoint: Selector.AGGREGATE,
      calldata: [calldata.length, ...calldata.flat()],
    })
    const raw = rawResult.slice(2)
  
    const result: string[][] = []
    let idx = 0
  
    for (let i = 0; i < raw.length; i += idx + 1) {
      idx = parseInt(raw[i], 16)
  
      result.push(raw.slice(i + 1, i + 1 + idx))
    }
  
    return result
  }