import {Call, getChecksumAddress, hash, shortString, uint256 } from 'starknet'

import { provider } from './services/provider'
import { TokenType, Memecoin } from './types'
import { MEMECOIN_FACTORY_ADDRESS, Selector } from './constants'
import { multiCallContract } from './calls'
import { getJediswapLiquidityLockPosition, getEkuboLiquidityLockPosition } from './liquidity'

export async function getTokenData(tokenAddress: string) {
  const calls: Call[] = [];
  calls.push({
    contractAddress: MEMECOIN_FACTORY_ADDRESS,
    entrypoint: hash.getSelector(Selector.IS_MEMECOIN),
    calldata: [tokenAddress],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.NAME),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.SYMBOL),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.IS_LAUNCHED),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.TOTAL_SUPPLY),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.GET_TEAM_ALLOCATION),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.OWNER),
    calldata: [],
  })

  calls.push({
    contractAddress: MEMECOIN_FACTORY_ADDRESS,
    entrypoint: hash.getSelector(Selector.LOCKED_LIQUIDITY),
    calldata: [tokenAddress],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.LAUNCHED_AT_BLOCK_NUMBER),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.LAUNCHED_WITH_LIQUIDITY_PARAMETERS),
    calldata: [],
  })

  return await multiCallContract(provider, calls);
}

export async function parseTokenData(tokenAddress: string, res: { result: string[] }): Promise<Memecoin | null> {
  const isUnruggable = !!+res.result[3] // beautiful

  if (!isUnruggable) return null

  const hasLiquidity = !+res.result[19] // even more beautiful
  const hasLaunchParams = !+res.result[26] // I'm delighted

  const isLaunched = !!+res.result[9] && hasLiquidity && hasLaunchParams // meh...

  const baseMemecoin = {
    address: tokenAddress,
    name: shortString.decodeShortString(res.result[5]),
    symbol: shortString.decodeShortString(res.result[7]),
    totalSupply: uint256.uint256ToBN({ low: res.result[11], high: res.result[12] }).toString(),
    owner: getChecksumAddress(res.result[17]),
  }

  if (isLaunched) {
    const launch = {
      teamAllocation: uint256.uint256ToBN({ low: res.result[14], high: res.result[15] }).toString(),
      blockNumber: +res.result[24],
    }

    const TokenTypeValue = Object.values(TokenType)[+res.result[21]] as TokenType

    const lockManager = res.result[20] as string

    switch (TokenTypeValue) {
      case TokenType.STARKDEFI_ERC20:
      case TokenType.JEDISWAP_ERC20: {
        const liquidity = {
          type: TokenTypeValue,
          lockManager,
          lockPosition: res.result[31],
          quoteToken: getChecksumAddress(res.result[28]),
          quoteAmount: uint256.uint256ToBN({ low: res.result[29], high: res.result[30] }).toString(),
        } as const

        return {
          ...baseMemecoin,
          isLaunched: true,
          launch,
          liquidity: {
            ...liquidity,
            ...(await getJediswapLiquidityLockPosition(liquidity)),
          },
        }
      }

      case TokenType.EKUBO_NFT: {
        const liquidity = {
          type: TokenType.EKUBO_NFT,
          lockManager,
          ekuboId: res.result[22],
          quoteToken: getChecksumAddress(res.result[33]),
          startingTick: +res.result[30] * (+res.result[31] ? -1 : 1), // mag * sign
        } as const

        return {
          ...baseMemecoin,
          isLaunched: true,
          launch,
          liquidity: {
            ...liquidity,
            ...(await getEkuboLiquidityLockPosition(liquidity)),
          },
        }
      }
    }
  } else {
    return { ...baseMemecoin, isLaunched: false }
  }
}