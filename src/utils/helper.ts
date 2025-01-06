import { Percent } from '@uniswap/sdk-core'

import { PERCENTAGE_INPUT_PRECISION, EKUBO_TICK_SIZE, EKUBO_TICK_SIZE_LOG, EKUBO_TICK_SPACING } from './constants'

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

export const getInitialPrice = (startingTick: number) => EKUBO_TICK_SIZE ** startingTick

export const getStartingTick = (initialPrice: number) =>
  Math.floor(Math.log(initialPrice) / EKUBO_TICK_SIZE_LOG / EKUBO_TICK_SPACING) * EKUBO_TICK_SPACING