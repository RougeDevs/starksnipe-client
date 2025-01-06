import { getChecksumAddress } from 'starknet'

export const MULTICALL_AGGREGATOR_ADDRESS = "0x01a33330996310a1e3fa1df5b16c1e07f0491fdd20c441126e02613b948f0225";
export const MEMECOIN_FACTORY_ADDRESS = "0x01a46467a9246f45c8c340f1f155266a26a71c07bd55d36e8d1c7d0d438a2dbc";
export const PERCENTAGE_INPUT_PRECISION = 2;
export const DECIMALS = 18
export const EKUBO_TICK_SIZE = 1.000001

export const EKUBO_TICK_SPACING = 5982 // log(1 + 0.6%) / log(1.000001) => 0.6% is the tick spacing percentage
export const EKUBO_TICK_SIZE_LOG = Math.log(EKUBO_TICK_SIZE)

export const LIQUIDITY_LOCK_FOREVER_TIMESTAMP = 9999999999 // 20/11/2286

export enum TOKEN_SYMBOL {
    ETH = 'ETH',
    STRK = 'STRK',
    USDC = 'USDC',
    USDT = 'USDT',
    WBTC = 'WBTC',
    DAI = 'DAI',
  }

export const TokenData = {
    Ether : {
        address: '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        symbol: TOKEN_SYMBOL.ETH,
        decimals: 18,
        camelCased: true,
      },
    USDC : {
        address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        symbol: TOKEN_SYMBOL.USDC,
        decimals: 6,
        camelCased: true,
      },
    STRK : {
        address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
        symbol: TOKEN_SYMBOL.STRK,
        decimals: 18,
        camelCased: true,
      },
    USDT : {
        address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
        symbol: TOKEN_SYMBOL.USDT,
        decimals: 6,
        camelCased: true,
      },
    WBTC : {
        address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
        symbol: TOKEN_SYMBOL.WBTC,
        decimals: 8,
        camelCased: true,
      },
    DAI :{
        address: '0x05574eb6b8789a91466f902c380d978e472db68170ff82a5b650b95a58ddf4ad',
        symbol: TOKEN_SYMBOL.DAI,
        decimals: 18,
        camelCased: true,
    }
  }

  export const QUOTE_TOKENS = {
    [getChecksumAddress(TokenData.Ether.address)]: TokenData.Ether,
    [getChecksumAddress(TokenData.USDC.address)]: TokenData.USDC,
    [getChecksumAddress(TokenData.STRK.address)]: TokenData.STRK,
  }

export enum Selector {
    IS_MEMECOIN = 'is_memecoin',
    AGGREGATE = 'aggregate',
    NAME = 'name',
    SYMBOL = 'symbol',
    IS_LAUNCHED = 'is_launched',
    GET_TEAM_ALLOCATION = 'get_team_allocation',
    TOTAL_SUPPLY = 'total_supply',
    OWNER = 'owner',
    LOCKED_LIQUIDITY = 'locked_liquidity',
    APPROVE = 'approve',
    GET_REMAINING_TIME = 'get_remaining_time',
    LAUNCHED_WITH_LIQUIDITY_PARAMETERS = 'launched_with_liquidity_parameters',
    GET_LOCK_DETAILS = 'get_lock_details',
    LAUNCHED_AT_BLOCK_NUMBER = 'launched_at_block_number',
    GET_RESERVES = 'get_reserves',
    LIQUIDITY_POSITION_DETAILS = 'liquidity_position_details',
    BALANCE_OF_CAMEL = 'balanceOf',
    BALANCE_OF = 'balance_of',
    TRANSFER = 'transfer',
    GET_TOKEN_INFOS = 'get_token_info',
  }