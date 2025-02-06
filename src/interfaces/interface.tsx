export type transaction={
    Date:string,
    type:string,
    amount:number,
    user:string,
    tx:string
}

export type holder={
    rank:number,
    address:string,
    amount:number,
    percentage:number,
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