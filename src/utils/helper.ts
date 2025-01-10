import { Percent } from '@uniswap/sdk-core'
import { PERCENTAGE_INPUT_PRECISION, EKUBO } from './constants'
import { AccountConfig, NetworkType, EkuboConfig } from './types'
import 'dotenv/config'
import { provider } from './services/provider'
import RouterABI from "./abi/Router.json";
import { Contract } from 'starknet';

export function isValidStarknetAddress(address: string): boolean {
  const regex = /^0x[0-9a-fA-F]{50,64}$/
  return regex.test(address)
}

export const decimalsScale = (decimals: number) => `1${Array(decimals).fill('0').join('')}`

export const formatPercentage = (percentage: Percent) => {
  const formatedPercentage = +percentage.toFixed(2)
  const exact = percentage.equalTo(new Percent(Math.round(formatedPercentage * 100), 10000))

  return `${exact ? '' : '~'}${formatedPercentage}%`
}

export const parsePercentage = (percentage: string | number) =>
  new Percent(+percentage * 10 ** PERCENTAGE_INPUT_PRECISION, 100 * 10 ** PERCENTAGE_INPUT_PRECISION)

export const getInitialPrice = (startingTick: number) => EKUBO.EKUBO_TICK_SIZE ** startingTick

export const getStartingTick = (initialPrice: number) =>
  Math.floor(Math.log(initialPrice) / EKUBO.EKUBO_TICK_SIZE_LOG / EKUBO.EKUBO_TICK_SPACING) * EKUBO.EKUBO_TICK_SPACING

export const getMinAmountOut = (expectedAmountOut: number, slippage: number) => Math.floor(expectedAmountOut - (expectedAmountOut * slippage) / 100)

export const account = (network: NetworkType = 'SEPOLIA') => {
  switch (network) {
    case 'MAINNET': return (
      {
        network: 'MAINNET',
        address: process.env.MAINNET_ACCOUNT_ADDRESS,
        provider: provider,
        private_key: process.env.MAINNET_PRIVATE_KEY
      } as AccountConfig
    )
    case 'SEPOLIA': return ({
      network: 'SEPOLIA',
      address: process.env.SEPOLIA_ACCOUNT_ADDRESS,
      provider: provider,
      private_key: process.env.SEPOLIA_PRIVATE_KEY
    } as AccountConfig)
    default: process.exit(1)
  }
}

export const ekubo = (network: NetworkType = 'SEPOLIA') => {
  switch (network) {
    case 'MAINNET': return ({
      network: network,
      api: process.env.NEXT_PUBLIC_MAINNET_EKUBO_QUOTE_API,
      router: new Contract(RouterABI, process.env.NEXT_PUBLIC_MAINNET_EKUBO_ROUTER_ADDRESS as string, account(network).provider),
    }) as EkuboConfig
    case 'SEPOLIA': return ({
      network: network,
      api: process.env.SEPOLIA_EKUBO_QUOTE_API,
      router: new Contract(RouterABI, process.env.SEPOLIA_EKUBO_ROUTER_ADDRESS as string, account(network).provider),
    }) as EkuboConfig
    default: process.exit(1)
  }
}
