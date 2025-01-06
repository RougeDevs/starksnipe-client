import { Fraction } from '@uniswap/sdk-core'

import { provider } from './services/provider'
import { EkuboMemecoin, JediswapMemecoin, LaunchedMemecoin, TokenType } from './types'
import { DECIMALS, LIQUIDITY_LOCK_FOREVER_TIMESTAMP, Selector, QUOTE_TOKENS } from './constants'
import { getInitialPrice, decimalsScale } from './helper'

export async function getJediswapLiquidityLockPosition(
  liquidity: Pick<JediswapMemecoin['liquidity'], 'lockPosition' | 'lockManager'>,
) {
  return provider
    .callContract({
      contractAddress: liquidity.lockManager,
      entrypoint: Selector.GET_LOCK_DETAILS,
      calldata: [liquidity.lockPosition],
    })
    .then((res) => {
      return {
        unlockTime: +res[4],
        owner: res[3],
      }
    })
}

export async function getEkuboLiquidityLockPosition(
  liquidity: Pick<EkuboMemecoin['liquidity'], 'ekuboId' | 'lockManager'>,
) {
  return provider
    .callContract({
      contractAddress: liquidity.lockManager,
      entrypoint: Selector.LIQUIDITY_POSITION_DETAILS,
      calldata: [liquidity.ekuboId],
    })
    .then((res) => {
      return {
        unlockTime: LIQUIDITY_LOCK_FOREVER_TIMESTAMP,
        owner: res[0],
        // pool key
        poolKey: {
          token0: res[2],
          token1: res[3],
          fee: res[4],
          tickSpacing: res[5],
          extension: res[6],
        },
        bounds: {
          lower: {
            mag: res[7],
            sign: res[8],
          },
          upper: {
            mag: res[9],
            sign: res[10],
          },
        },
      }
    })
}

export async function getEtherPrice(blockNumber: number) {
    // Todo - implement this function
  return blockNumber * 0
}

export async function parseLiquidityParams(memecoin: LaunchedMemecoin) {
  // quote token
  const quoteTokenInfos = QUOTE_TOKENS[memecoin.liquidity.quoteToken]
  const isQuoteTokenSafe = !!quoteTokenInfos

  // starting mcap
  const ethPriceAtLaunch = await getEtherPrice(memecoin.launch.blockNumber)
  let startingMcap: Fraction | undefined

  switch (memecoin.liquidity.type) {
    case TokenType.STARKDEFI_ERC20:
    case TokenType.JEDISWAP_ERC20: {
      startingMcap = isQuoteTokenSafe
        ? new Fraction(memecoin.liquidity.quoteAmount)
            .multiply(new Fraction(memecoin.launch.teamAllocation, memecoin.totalSupply).add(1))
            .divide(decimalsScale(DECIMALS))
            .multiply(ethPriceAtLaunch)
        : undefined

      break
    }

    case TokenType.EKUBO_NFT: {
      const initialPrice = getInitialPrice(memecoin.liquidity.startingTick)
      startingMcap = isQuoteTokenSafe
        ? new Fraction(Math.round(initialPrice * +decimalsScale(DECIMALS)), decimalsScale(DECIMALS))
            .multiply(ethPriceAtLaunch)
            .multiply(memecoin.totalSupply)
            .divide(decimalsScale(DECIMALS))
        : undefined
    }
  }

  const parsedStartingMcap = startingMcap ? `$${startingMcap.toFixed(0, { groupSeparator: ',' })}` : 'UNKNOWN'

  return {
    isQuoteTokenSafe,
    parsedStartingMcap,
  }
}