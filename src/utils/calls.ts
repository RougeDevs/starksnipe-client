import {Call, CallData, RawArgs} from "starknet";
import { MULTICALL_AGGREGATOR_ADDRESS } from "./constants";
import {Selector} from "./constants";

export function getMultiViewCall(args : RawArgs[]): Call{
    return {
        contractAddress : MULTICALL_AGGREGATOR_ADDRESS,
        entrypoint : Selector.AGGREGATE,
        calldata: CallData.compile([args.length, ...args]),
    };
}