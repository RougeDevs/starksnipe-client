import { Account, Call, CallData, hash } from "starknet";
import { MULTICALL_AGGREGATOR_ADDRESS, USER_BALANCE_CONTRACT_ADDRESS } from "./constants";
import { Selector } from "./constants";
import { account, parseUserTokenData, processAddress } from './helper'
import { EkuboTokenData, NetworkType } from "./types";
import { getAllTokens } from "./ekubo";

export async function multiCallContract(
  calls: Call[],
) {
  const calldata = calls.map((call) => {
    return CallData.compile({
      to: call.contractAddress,
      selector: hash.getSelector(call.entrypoint),
      calldata: call.calldata ?? [],
    })
  })

  const rawResult = await account("MAINNET").provider.callContract({
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

export async function multiCallExecute(network: NetworkType, calls: Call[]) {
  const account_config = account(network);
  const caller = new Account(account_config.provider, account_config.address, account_config.private_key);

  const estimated_gas_fee = (await caller.estimateInvokeFee(calls, {
    blockIdentifier: 'latest',
    skipValidate: true
  })).overall_fee;
  return await caller.execute(calls, {
    maxFee: estimated_gas_fee,
    skipValidate: true
  });
}

export async function getUserTokenBalances(network: NetworkType, userAddress: string, tokens: EkuboTokenData[]) {
  const rawResult = await account(network).provider.callContract({
    contractAddress: USER_BALANCE_CONTRACT_ADDRESS,
    entrypoint: Selector.GET_BALANCES,
    calldata: [userAddress, tokens.length, ...tokens.map((token) => token.l2_token_address)]
  })

  const tokenMap = new Map(
    tokens.map(token => [processAddress(token.l2_token_address), token])
  );

  return parseUserTokenData(rawResult, tokenMap);
}