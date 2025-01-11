import { Percent } from '@uniswap/sdk-core'
import { PERCENTAGE_INPUT_PRECISION, EKUBO, USER_BALANCE_CONTRACT_ADDRESS, Selector } from './constants'
import { AccountConfig, NetworkType, EkuboConfig, EkuboTokenData, UserTokenData } from './types'
import 'dotenv/config'
import { provider } from './services/provider'
import RouterABI from "./abi/Router.json";
import { Contract } from 'starknet';
import { processAddress } from '@/Blockchain/utils/utils'

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
export function parseTokenData(rawResult: string[], tokenMap: Map<string, EkuboTokenData>): { userTokenData: UserTokenData, remainingTokens: EkuboTokenData[] } {
  const total = Number(rawResult[0]);
  const balances = [];
  const processedAddresses = new Set<string>();

  for (let i = 1; i < rawResult.length - 2; i += 3) {
    const address = processAddress(rawResult[i]);
    const low = rawResult[i + 1].slice(2).padStart(16, '0');
    const high = rawResult[i + 2].slice(2).padStart(16, '0');
    const balance = BigInt('0x' + high + low);
    const tokenInfo = tokenMap.get(address);

    if (tokenInfo) {
      balances.push({
        address,
        balance,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        logo_url: tokenInfo.logo_url
      });

      processedAddresses.add(address);
    } else {
      console.warn(`Token info not found for address: ${address}`);
    }
  }

  const remainingTokens = Array.from(tokenMap.values()).filter(
    token => !processedAddresses.has(processAddress(token.l2_token_address))
  );
  return {
    userTokenData: {
      total,
      tokens: balances
    } as UserTokenData,
    remainingTokens: remainingTokens as EkuboTokenData[]
  };
}

export async function getParsedTokenData(network: NetworkType, userAddress: string, tokens: EkuboTokenData[]) {
  const rawResult = await account(network).provider.callContract({
    contractAddress: USER_BALANCE_CONTRACT_ADDRESS,
    entrypoint: Selector.GET_BALANCES,
    calldata: [userAddress, tokens.length, ...tokens.map((token) => token.l2_token_address)]
  })

  const tokenMap = new Map(
    tokens.map(token => [processAddress(token.l2_token_address), token])
  );

  return parseTokenData(rawResult, tokenMap);
}

export const parsePercentage = (percentage: string | number) =>
  new Percent(+percentage * 10 ** PERCENTAGE_INPUT_PRECISION, 100 * 10 ** PERCENTAGE_INPUT_PRECISION)

export const getInitialPrice = (startingTick: number) => EKUBO.EKUBO_TICK_SIZE ** startingTick

export const getStartingTick = (initialPrice: number) =>
  Math.floor(Math.log(initialPrice) / EKUBO.EKUBO_TICK_SIZE_LOG / EKUBO.EKUBO_TICK_SPACING) * EKUBO.EKUBO_TICK_SPACING

export const getMinAmountOut = (expectedAmountOut: bigint, slippage: bigint) => Math.floor(Number(expectedAmountOut - (expectedAmountOut * slippage) / BigInt(100)))

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

export const avnu = (network: NetworkType = 'SEPOLIA') => {
  switch (network) {
    case 'MAINNET': return ({
      network: network,
      api: process.env.NEXT_PUBLIC_MAINNET_AVNU_API
    }) as EkuboConfig
    case 'SEPOLIA': return ({
      network: network,
      api: process.env.NEXT_PUBLIC_SEPOLIA_AVNU_API
    }) as EkuboConfig
    default: process.exit(1)
  }
}

function isKeyOfEkuboTokenData(key: string): key is keyof EkuboTokenData {
  const validKeys: Array<keyof EkuboTokenData> = [
    'name',
    'symbol',
    'decimals',
    'l2_token_address',
    'sort_order',
    'total_supply',
    'hidden',
    'disabled',
    'logo_url'
  ];
  return validKeys.includes(key as keyof EkuboTokenData);
}

export function filterEkuboTokens(tokens: EkuboTokenData[], filters: Partial<EkuboTokenData>): EkuboTokenData[] {
  return tokens.filter(token => {
    return Object.entries(filters).every(([key, value]) => {
      if (!isKeyOfEkuboTokenData(key)) {
        return true;
      }

      if (value === undefined || value === null) {
        return true;
      }

      if (typeof value === 'string' && typeof token[key] === 'string') {
        return token[key].toLowerCase().includes(value.toLowerCase());
      }

      return token[key] === value;
    });
  });
}
