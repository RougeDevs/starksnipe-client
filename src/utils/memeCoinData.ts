import { Call, getChecksumAddress, hash, shortString, uint256 } from 'starknet'

import { provider } from './services/provider'
import { Memecoin } from './types'
import { MEMECOIN_FACTORY_ADDRESS, Selector, EKUBO } from './constants'
import { multiCallContract } from './calls'
import { getEkuboLiquidityLockPosition } from './liquidity'

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
    entrypoint: hash.getSelector(Selector.TOTAL_SUPPLY),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.OWNER),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.IS_LAUNCHED),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.LAUNCHED_AT_BLOCK_NUMBER),
    calldata: [],
  })

  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.GET_TEAM_ALLOCATION),
    calldata: [],
  })

  calls.push({
    contractAddress: MEMECOIN_FACTORY_ADDRESS,
    entrypoint: hash.getSelector(Selector.EXCHANGE),
    calldata: [EKUBO.EXCHANGE_ID],
  })

  calls.push({
    contractAddress: MEMECOIN_FACTORY_ADDRESS,
    entrypoint: hash.getSelector(Selector.LOCKED_LIQUIDITY),
    calldata: [tokenAddress],
  })


  calls.push({
    contractAddress: tokenAddress,
    entrypoint: hash.getSelector(Selector.LAUNCHED_WITH_LIQUIDITY_PARAMETERS),
    calldata: [],
  })

  return await multiCallContract(provider, calls);
}

export async function parseTokenData(tokenAddress: string, res: string[][]): Promise<Memecoin | null> {
  const isUnruggable = !!+res[0][0]

  const baseMemecoin = {
    address: tokenAddress,
    name: shortString.decodeShortString(res[1][0]),
    symbol: shortString.decodeShortString(res[2][0]),
    totalSupply: uint256.uint256ToBN({ low: res[3][0], high: res[3][1] }).toString(),
    owner: getChecksumAddress(res[4][0]),
  }

  if (!isUnruggable) return null

  const hasLiquidity = !+res[9][0]
  const hasLaunchParams = !+res[10][0]

  const isLaunched = !!+res[5][0] && hasLiquidity && hasLaunchParams


  if (isLaunched) {
    const launch = {
      teamAllocation: uint256.uint256ToBN({ low: res[7][0], high: res[7][1] }).toString(),
      blockNumber: +res[6][0],
    }

    const TokenTypeValue = res[9][3].toString()
    if (TokenTypeValue != EKUBO.EKUBO_NFT) {
      console.error('Not Ekubo_NFT')
      process.exit(1)
    }
    const liquidity = {
      launchManager: getChecksumAddress(res[9][1]),
      ekuboId: TokenTypeValue,
      quoteToken: getChecksumAddress(res[10][7]),
      startingTick: +res[10][4] * (+res[10][5] ? -1 : 1), // mag * sign
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
  } else {
    return { ...baseMemecoin, isLaunched: false }
  }
}