import { Fraction } from '@uniswap/sdk-core'

import { provider } from './services/provider'
import { EkuboMemecoin } from './types'
import { DECIMALS, LIQUIDITY_LOCK_FOREVER_TIMESTAMP, Selector, QUOTE_TOKENS } from './constants'
import { getInitialPrice, decimalsScale } from './helper'

export async function getEkuboLiquidityLockPosition(
    liquidity: Pick<EkuboMemecoin['liquidity'], 'ekuboId' | 'launchManager'>,
) {
    return provider
        .callContract({
            contractAddress: liquidity.launchManager,
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

export async function parseLiquidityParams(memecoin: EkuboMemecoin) {
    // quote token
    const quoteTokenInfos = QUOTE_TOKENS[memecoin.liquidity.quoteToken]
    const isQuoteTokenSafe = !!quoteTokenInfos

    // starting mcap
    const ethPriceAtLaunch = await getEtherPrice(memecoin.launch.blockNumber)

    const initialPrice = getInitialPrice(memecoin.liquidity.startingTick)
    const startingMcap: Fraction | undefined = isQuoteTokenSafe
        ? new Fraction(Math.round(initialPrice * +decimalsScale(DECIMALS)), decimalsScale(DECIMALS))
            .multiply(ethPriceAtLaunch)
            .multiply(memecoin.totalSupply)
            .divide(decimalsScale(DECIMALS))
        : undefined

    const parsedStartingMcap = startingMcap ? `$${startingMcap.toFixed(0, { groupSeparator: ',' })}` : 'UNKNOWN'

    return {
        isQuoteTokenSafe,
        parsedStartingMcap,
    }
}