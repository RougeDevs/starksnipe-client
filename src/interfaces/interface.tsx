export type transaction={
    Date:string,
    type:string,
    amount:number,
    user:string,
    tx:string
}

export type holder={
    holder:string,
    holder_id:string,
    balance:string,
    balance_separated:string,
    decimals:string,
    percentage:string,
    last_transfer_time:number
}

export type tradeType='buy' | 'sell'

export type currency={
    code:string,
    country:string,
    countryCode:string,
    flag:string,
    name:string,
    usd_price:number
}

export type token={
    coinData:{
        address:string,
        name:string,
        symbol:string,
        total_supply:string,
        owner:string,
        team_allocation:string,
        launched_at_block:string,
        current_price:string,
        market_cap:string,
        icon_url:string,
        total_holders:string
    },
    holders:holder[]

}

export type SwapToken={
    tokenAddress:string,
    symbol:string,
    logo_url:string
}

export type Pricer={
    decimals:number,
    priceInETH:string,
    priceInUSD:number,
    tokenAddress:string
}

export type tokenTransaction={
    tx_hash:string,
    account_address:string,
    account_id:string,
    trade_type:tradeType,
    amount:number,
    formatted_amount:string,
    timestamp:number
}