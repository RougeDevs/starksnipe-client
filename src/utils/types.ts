import { TOKEN_SYMBOL } from './constants'

export type USDCPair = {
    address: string
    reversed: boolean
}

export type Token = {
    address: string
    symbol: TOKEN_SYMBOL
    name: string
    decimals: number
    camelCased?: boolean
    usdcPair?: USDCPair
}

interface i129 {
    mag: string
    sign: string
}

interface EkuboPoolKey {
    token0: string
    token1: string
    fee: string
    tickSpacing: string
    extension: string
}

interface EkuboBounds {
    lower: i129
    upper: i129
}

interface BaseMemecoin {
    address: string
    name: string
    symbol: string
    totalSupply: string
    isLaunched: boolean
    owner: string
}

interface BaseLaunchedMemecoin extends BaseMemecoin {
    isLaunched: true
    launch: {
        blockNumber: number
        teamAllocation: string
    }
}

interface BaseLiquidity {
    launchManager: string
    unlockTime: number
    owner: string
    quoteToken: string
}

export interface EkuboMemecoin extends BaseLaunchedMemecoin {
    liquidity: {
        ekuboId: string
        startingTick: number
        poolKey: EkuboPoolKey
        bounds: EkuboBounds
    } & Omit<BaseLiquidity, 'type'>
}

interface NotLaunchedMemecoin extends BaseMemecoin {
    isLaunched: false
}

export type Memecoin = EkuboMemecoin | NotLaunchedMemecoin