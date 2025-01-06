import { Fraction } from '@uniswap/sdk-core'

import { DECIMALS } from './constants'
import { Memecoin, TokenType } from './types'
import { decimalsScale, getInitialPrice } from './helper'

// eslint-disable-next-line import/no-unused-modules
export function getStartingMarketCap(memecoin: Memecoin, quoteToken: string, quoteTokenPriceAtLaunch?: Fraction): Fraction | undefined {
  if (!memecoin.isLaunched || !quoteTokenPriceAtLaunch) return undefined

  switch (memecoin.liquidity.type) {
    case TokenType.STARKDEFI_ERC20:
    case TokenType.JEDISWAP_ERC20: {
      // starting mcap = quote amount in liq * (team allocation % + 100) * quote token price at launch
      return new Fraction(memecoin.liquidity.quoteAmount)
        .multiply(new Fraction(memecoin.launch.teamAllocation, memecoin.totalSupply).add(1))
        .divide(decimalsScale(quoteToken === 'ETH' ? 18 : DECIMALS))
        .multiply(quoteTokenPriceAtLaunch)
    }

    case TokenType.EKUBO_NFT: {
      // get starting price from starting tick
      const initialPrice = getInitialPrice(memecoin.liquidity.startingTick)

      // starting mcap = initial price * quote token price at launch * total supply
      return new Fraction(
        initialPrice.toFixed(DECIMALS).replace(/\./, '').replace(/^0+/, ''), // from 0.000[...]0001 to "1"
        decimalsScale(DECIMALS),
      )
        .multiply(quoteTokenPriceAtLaunch)
        .multiply(memecoin.totalSupply)
        .divide(decimalsScale(DECIMALS))
    }
  }
}